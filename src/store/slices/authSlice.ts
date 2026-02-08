import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, LoginCredentials } from '../../types';
import { authApi } from '../../api/authApi';
import { tokenStorage } from '../../utils/tokenStorage';

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const user = await authApi.login(credentials);
      
      // Сохраняем токены после успешного логина
      tokenStorage.saveTokens(user.accessToken, user.refreshToken, credentials.rememberMe);
      
      return user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка входа');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    tokenStorage.clearTokens();
  }
);

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const { token, refreshToken: storedRefreshToken } = tokenStorage.getTokens();
      
      if (!token || !storedRefreshToken) {
        return rejectWithValue('Токен не найден');
      }

      try {
        // Сначала пробуем проверить текущий токен
        const user = await authApi.getCurrentUser(token);
        return {
          ...user,
          refreshToken: storedRefreshToken,
        };
      } catch {
        // Если токен недействителен, пробуем обновить
        try {
          const newAccessToken = await authApi.refreshToken(storedRefreshToken);
          
          // Обновляем токены в хранилище
          const rememberMe = tokenStorage.isRemembered();
          tokenStorage.saveTokens(newAccessToken, storedRefreshToken, rememberMe);
          
          // Повторяем запрос с новым токеном
          const user = await authApi.getCurrentUser(newAccessToken);
          return {
            ...user,
            refreshToken: storedRefreshToken,
          };
        } catch {
          // Если обновление не удалось, очищаем токены
          tokenStorage.clearTokens();
          return rejectWithValue('Токен не найден или недействителен');
        }
      }
    } catch {
      return rejectWithValue('Ошибка проверки авторизации');
    }
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Check auth
      .addCase(checkAuthAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthAsync.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
