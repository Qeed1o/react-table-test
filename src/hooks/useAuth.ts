import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { loginAsync, logoutAsync, checkAuthAsync } from '../store/slices/authSlice';
import type { LoginCredentials } from '../types';

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
  token: string;
  refreshToken: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const loginData: LoginRequest = {
      username: credentials.login,
      password: credentials.password,
      expiresInMins: 30,
    };

    try {
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
        localStorage.setItem('token', data.token);
      } else {
        sessionStorage.setItem('token', data.token);
      }

      // Преобразование ответа API в наш формат User
      const user = {
        id: data.id.toString(),
        login: data.username,
        token: data.token,
      };

      return user;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Ошибка входа');
    }
  }, []);

  const loginWithDispatch = useCallback(
    (credentials: LoginCredentials) => {
      return dispatch(loginAsync(credentials));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutAsync());
  }, [dispatch]);

  const checkAuth = useCallback(() => {
    return dispatch(checkAuthAsync());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginWithDispatch,
    logout,
    checkAuth,
  };
};
