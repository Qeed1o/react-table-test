import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { loginAsync, logoutAsync, checkAuthAsync } from '../store/slices/authSlice';
import type { LoginCredentials } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
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
    logout,
    checkAuth,
  };
};
