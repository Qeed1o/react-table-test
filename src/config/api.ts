export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  PRODUCTS: '/products',
} as const;
