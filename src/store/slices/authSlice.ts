import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, LoginCredentials } from '../../types';

// Mock API call
const mockLogin = async (credentials: LoginCredentials): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.login === 'admin' && credentials.password === 'password') {
        resolve({
          id: '1',
          login: credentials.login,
          token: 'mock-jwt-token',
        });
      } else {
        reject(new Error('Неверный логин или пароль'));
      }
    }, 1000);
  });
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const user = await mockLogin(credentials);
      
      // Сохранение токена в зависимости от чекбокса "Запомнить меня"
      if (credentials.rememberMe) {
        localStorage.setItem('token', user.token);
      } else {
        sessionStorage.setItem('token', user.token);
      }
      
      return user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка входа');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }
);

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (token) {
        // Mock проверка токена
        if (token === 'mock-jwt-token') {
          return {
            id: '1',
            login: 'admin',
            token,
          };
        }
      }
      
      return rejectWithValue('Токен не найден');
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
