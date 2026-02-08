// Базовые типы приложения

export interface User {
  id: string;
  login: string;
  accessToken: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  vendor: string;
  sku: string;
  rating: number;
  description?: string;
  image?: string;
  category?: string;
}

export interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  sorting: {
    field: keyof Product;
    direction: 'asc' | 'desc';
  };
  search: string;
}

export interface AddProductModalState {
  isOpen: boolean;
  isSubmitting: boolean;
  error: string | null;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
}

export interface RootState {
  auth: AuthState;
  products: ProductsState;
  addProductModal: AddProductModalState;
  toast: ToastState;
}

export interface LoginCredentials {
  login: string;
  password: string;
  rememberMe: boolean;
}

export interface AddProductForm {
  name: string;
  price: string;
  vendor: string;
  sku: string;
}
