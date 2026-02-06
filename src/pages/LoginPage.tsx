import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { loginAsync, clearError } from '../store/slices/authSlice';
import { showToast } from '../store/slices/toastSlice';
import type { LoginCredentials } from '../types';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [credentials, setCredentials] = useState<LoginCredentials>({
    login: '',
    password: '',
    rememberMe: false,
  });

  const [fieldErrors, setFieldErrors] = useState<{
    login?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(showToast({
        message: 'Вход выполнен успешно',
        type: 'success',
      }));
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(showToast({
        message: error,
        type: 'error',
      }));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!credentials.login.trim()) {
      errors.login = 'Логин обязателен';
    }

    if (!credentials.password.trim()) {
      errors.password = 'Пароль обязателен';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(loginAsync(credentials));
    }
  };

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'rememberMe' 
      ? e.target.checked 
      : e.target.value;
    
    setCredentials(prev => ({
      ...prev,
      [field]: value,
    }));

    // Очистка ошибки поля при вводе
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Вход в систему
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label="Логин"
              name="login"
              autoComplete="username"
              autoFocus
              value={credentials.login}
              onChange={handleInputChange('login')}
              error={!!fieldErrors.login}
              helperText={fieldErrors.login}
              disabled={isLoading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleInputChange('password')}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              disabled={isLoading}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={credentials.rememberMe}
                  onChange={handleInputChange('rememberMe')}
                  disabled={isLoading}
                />
              }
              label="Запомнить меня"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Войти'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
