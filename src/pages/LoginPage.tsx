import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  Clear,
  VolumeUp,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { useAuth } from '../hooks/useAuth';
import { clearError } from '../store/slices/authSlice';
import { showToast } from '../store/slices/toastSlice';
import type { LoginCredentials } from '../types';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const { login } = useAuth();

  // Если пользователь уже авторизован, перенаправляем на страницу товаров
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(showToast({
        message: 'Вход выполнен успешно',
        type: 'success',
      }));
      navigate('/products');
    }
  }, [isAuthenticated, navigate, dispatch]);

  const [credentials, setCredentials] = useState<LoginCredentials>({
    login: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    login?: string;
    password?: string;
  }>({});

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
      login(credentials);
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

  const handleClearLogin = () => {
    setCredentials(prev => ({
      ...prev,
      login: '',
    }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        margin: 0,
        padding: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 515,
          borderRadius: 3,
        }}
      >
          {/* Icon */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <VolumeUp sx={{ fontSize: 48, color: '#1976d2' }} />
          </Box>

          {/* Title */}
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 600, mb: 1 }}
          >
            Добро пожаловать!
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Пожалуйста, авторизируйтесь
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Login Field */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Логин
            </Typography>
            <TextField
              fullWidth
              id="login"
              placeholder="Логин"
              tabIndex={0}
              name="login"
              autoComplete="username"
              value={credentials.login}
              onChange={handleInputChange('login')}
              error={!!fieldErrors.login}
              helperText={fieldErrors.login}
              disabled={isLoading}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: credentials.login && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClearLogin}
                      edge="end"
                      disabled={isLoading}
                    >
                      <Clear sx={{ fontSize: 20 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Field */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Пароль
            </Typography>
            <TextField
              fullWidth
              name="password"
              tabIndex={1}
              placeholder="Пароль"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleInputChange('password')}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              disabled={isLoading}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ fontSize: 20 }} />
                      ) : (
                        <Visibility sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Remember Me Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={credentials.rememberMe}
                  onChange={handleInputChange('rememberMe')}
                  disabled={isLoading}
                  sx={{ '&.Mui-checked': { color: '#1976d2' } }}
                />
              }
              label="Запомнить данные"
              sx={{ mb: 3 }}
            />

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              tabIndex={2}
              sx={{
                mb: 2,
                py: 1.5,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
            </Button>

            {/* Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
                или
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            {/* No Account Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Нет аккаунта?{' '}
                <Button
                  variant="text"
                  sx={{
                    p: 0,
                    minWidth: 'auto',
                    textTransform: 'none',
                    color: '#1976d2',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Создать
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
    </Box>
  );
};

export default LoginPage;
