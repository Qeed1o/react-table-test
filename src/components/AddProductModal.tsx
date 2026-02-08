import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Fade,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { 
  closeModal, 
  setSubmitting, 
  setError, 
  clearError 
} from '../store/slices/addProductModalSlice';
import { addProduct } from '../store/slices/productsSlice';
import { showToast } from '../store/slices/toastSlice';
import type { AddProductForm, Product } from '../types';
import { VALIDATION_RULES, validateAddProductForm, hasValidationErrors, type AddProductFormErrors } from '../utils/validation';
import FormTextField from './FormTextField';
import ErrorMessage from './ErrorMessage';


// Начальные значения формы
const INITIAL_FORM_DATA: AddProductForm = {
  name: '',
  price: '',
  vendor: '',
  sku: '',
};

// Стили для диалога
const dialogStyles = {
  borderRadius: 3,
  animation: 'slideIn 0.3s ease-out',
};

const transitionDuration = {
  enter: 300,
  exit: 200,
};

const AddProductModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, isSubmitting, error } = useAppSelector((state) => state.addProductModal);

  const [formData, setFormData] = useState<AddProductForm>(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState<AddProductFormErrors>({});

  // Сброс формы при закрытии модального окна
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setFieldErrors({});
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  // Валидация формы
  const validateForm = useCallback((): boolean => {
    const errors = validateAddProductForm(formData);
    setFieldErrors(errors);
    return !hasValidationErrors(errors);
  }, [formData]);

  // Создание нового товара
  const createNewProduct = useCallback((): Product => {
    return {
      id: `product-${Date.now()}`,
      name: formData.name.trim(),
      price: Number(formData.price),
      vendor: formData.vendor.trim(),
      sku: formData.sku.trim(),
      rating: Math.floor(Math.random() * (VALIDATION_RULES.MAX_RATING - VALIDATION_RULES.MIN_RATING + 1)) + VALIDATION_RULES.MIN_RATING,
    };
  }, [formData]);

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(setSubmitting(true));
      dispatch(clearError());

      const newProduct = createNewProduct();
      dispatch(addProduct(newProduct));
      
      dispatch(showToast({
        message: 'Товар успешно добавлен',
        type: 'success',
      }));

      dispatch(closeModal());
    } catch {
      dispatch(setError('Ошибка при добавлении товара'));
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  // Обработчик закрытия модального окна
  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      dispatch(closeModal());
    }
  }, [isSubmitting, dispatch]);

  // Обработчик изменения полей формы
  const handleInputChange = useCallback((field: keyof AddProductForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Очистка ошибки поля при вводе
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }, [fieldErrors]);

  return (
    <Dialog 
      open={isOpen} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={transitionDuration}
      PaperProps={{
        sx: dialogStyles,
      }}
    >
      <DialogTitle>Добавить новый товар</DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <FormTextField
              label="Наименование"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={fieldErrors.name}
              disabled={isSubmitting}
            />

            <FormTextField
              label="Цена"
              value={formData.price}
              onChange={handleInputChange('price')}
              error={fieldErrors.price}
              disabled={isSubmitting}
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
            />

            <FormTextField
              label="Вендор"
              value={formData.vendor}
              onChange={handleInputChange('vendor')}
              error={fieldErrors.vendor}
              disabled={isSubmitting}
            />

            <FormTextField
              label="Артикул"
              value={formData.sku}
              onChange={handleInputChange('sku')}
              error={fieldErrors.sku}
              disabled={isSubmitting}
            />

            {error && (
              <ErrorMessage message={error} />
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Добавить'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddProductModal;
