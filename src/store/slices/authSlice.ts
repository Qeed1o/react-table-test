import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, LoginCredentials } from '../../types';

interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

interface AuthResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

// Real API call
const loginApi = async (credentials: LoginCredentials): Promise<User> => {
  const loginData: LoginRequest = {
    username: credentials.login,
    password: credentials.password,
    expiresInMins: 30,
  };

  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    throw new Error('Неверный логин или пароль');
  }

  const data: AuthResponse = await response.json();

  // Сохранение токена в зависимости от чекбокса "Запомнить меня"
  if (credentials.rememberMe) {
    localStorage.setItem('token', data.accessToken);
  } else {
    sessionStorage.setItem('token', data.accessToken);
  }

  // Преобразование ответа API в наш формат User
  return {
    id: data.id.toString(),
    login: data.username,
    accessToken: data.accessToken,
  };
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const user = await loginApi(credentials);
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
        // Проверка токена через API
        const response = await fetch('https://dummyjson.com/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Преобразование ответа API в наш формат User
          return {
            id: data.id.toString(),
            login: data.username,
            token,
          };
        }
      }
      
      return rejectWithValue('Токен не найден или недействителен');
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
