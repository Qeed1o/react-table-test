import type { AddProductForm, LoginCredentials } from '../types';

// Константы для валидации
export const VALIDATION_RULES = {
  REQUIRED_FIELD: 'Поле обязательно для заполнения',
  INVALID_PRICE: 'Цена должна быть положительным числом',
  MIN_RATING: 1,
  MAX_RATING: 5,
} as const;

// Типы ошибок валидации
export type AddProductFormErrors = Partial<AddProductForm>;
export type LoginFormErrors = {
  login?: string;
  password?: string;
};
export type ValidationErrors = AddProductFormErrors | LoginFormErrors;

// Функция валидации формы добавления товара
export const validateAddProductForm = (formData: AddProductForm): AddProductFormErrors => {
  const errors: AddProductFormErrors = {};

  if (!formData.name.trim()) {
    errors.name = VALIDATION_RULES.REQUIRED_FIELD;
  }

  if (!formData.price.trim()) {
    errors.price = VALIDATION_RULES.REQUIRED_FIELD;
  } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
    errors.price = VALIDATION_RULES.INVALID_PRICE;
  }

  if (!formData.vendor.trim()) {
    errors.vendor = VALIDATION_RULES.REQUIRED_FIELD;
  }

  if (!formData.sku.trim()) {
    errors.sku = VALIDATION_RULES.REQUIRED_FIELD;
  }

  return errors;
};

// Проверка, есть ли ошибки валидации
export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

// Функция валидации формы входа
export const validateLoginForm = (credentials: LoginCredentials): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (!credentials.login.trim()) {
    errors.login = 'Логин обязателен';
  }

  if (!credentials.password.trim()) {
    errors.password = 'Пароль обязателен';
  }

  return errors;
};
