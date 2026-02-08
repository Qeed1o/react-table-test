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

// Функция обновления токена
const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const response = await fetch('https://dummyjson.com/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Не удалось обновить токен');
  }

  const data = await response.json();
  return data.accessToken;
};

// Функция сохранения токенов
const saveTokens = (accessToken: string, refreshToken: string, rememberMe: boolean) => {
  if (rememberMe) {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  } else {
    sessionStorage.setItem('token', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
  }
};

// Функция получения токенов
const getTokens = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
  return { token, refreshToken };
};
const loginApi = async (credentials: LoginCredentials): Promise<User> => {
  const loginData: LoginRequest = {
    username: credentials.login,
    password: credentials.password,
    expiresInMins: 5,
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

  // Сохранение токенов в зависимости от чекбокса "Запомнить меня"
  if (credentials.rememberMe) {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  } else {
    sessionStorage.setItem('token', data.accessToken);
    sessionStorage.setItem('refreshToken', data.refreshToken);
  }

  // Преобразование ответа API в наш формат User
  return {
    id: data.id.toString(),
    login: data.username,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
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
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
  }
);

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const { token, refreshToken: storedRefreshToken } = getTokens();
      
      if (token && storedRefreshToken) {
        // Сначала пробуем проверить текущий токен
        let response = await fetch('https://dummyjson.com/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          return {
            id: data.id.toString(),
            login: data.username,
            accessToken: token,
            refreshToken: storedRefreshToken,
          };
        }

        // Если токен недействителен, пробуем обновить
        try {
          const newAccessToken = await refreshAccessToken(storedRefreshToken);
          
          // Обновляем токены в хранилище
          const rememberMe = localStorage.getItem('token') !== null;
          saveTokens(newAccessToken, storedRefreshToken, rememberMe);
          
          // Повторяем запрос с новым токеном
          response = await fetch('https://dummyjson.com/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${newAccessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            
            return {
              id: data.id.toString(),
              login: data.username,
              accessToken: newAccessToken,
              refreshToken: storedRefreshToken,
            };
          }
        } catch {
          // Если обновление не удалось, очищаем токены
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('refreshToken');
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
