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
import { addProduct, updateProduct } from '../store/slices/productsSlice';
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
  const { isOpen, isSubmitting, error, isEditMode, editingProductId } = useAppSelector((state) => state.addProductModal);
  const { products } = useAppSelector((state) => state.products);

  const [formData, setFormData] = useState<AddProductForm>(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState<AddProductFormErrors>({});

  // Сброс формы при закрытии модального окна
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setFieldErrors({});
    dispatch(clearError());
  }, [dispatch]);

  // Заполнение формы данными продукта при открытии в режиме редактирования
  useEffect(() => {
    if (isOpen && isEditMode && editingProductId) {
      const product = products.find(p => p.id === editingProductId);
      if (product) {
        setFormData({
          name: product.name,
          price: product.price.toString(),
          vendor: product.vendor,
          sku: product.sku,
        });
      }
    } else if (!isOpen) {
      resetForm();
    }
  }, [isOpen, isEditMode, editingProductId, products, resetForm]);

  // Валидация формы
  const validateForm = useCallback((): boolean => {
    const errors = validateAddProductForm(formData);
    setFieldErrors(errors);
    return !hasValidationErrors(errors);
  }, [formData]);

  // Создание или обновление товара
  const saveProduct = useCallback((): Product => {
    const baseProduct = {
      name: formData.name.trim(),
      price: Number(formData.price),
      vendor: formData.vendor.trim(),
      sku: formData.sku.trim(),
    };

    if (isEditMode && editingProductId) {
      // В режиме редактирования сохраняем существующие данные продукта
      const existingProduct = products.find(p => p.id === editingProductId);
      if (existingProduct) {
        return {
          ...existingProduct,
          ...baseProduct,
        };
      }
    }

    // В режиме создания нового продукта
    return {
      id: isEditMode && editingProductId ? editingProductId : `product-${Date.now()}`,
      ...baseProduct,
      rating: Math.floor(Math.random() * (VALIDATION_RULES.MAX_RATING - VALIDATION_RULES.MIN_RATING + 1)) + VALIDATION_RULES.MIN_RATING,
    };
  }, [formData, isEditMode, editingProductId, products]);

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(setSubmitting(true));
      dispatch(clearError());

      const savedProduct = saveProduct();
      
      if (isEditMode) {
        dispatch(updateProduct(savedProduct));
        dispatch(showToast({
          message: 'Товар успешно обновлен',
          type: 'success',
        }));
      } else {
        dispatch(addProduct(savedProduct));
        dispatch(showToast({
          message: 'Товар успешно добавлен',
          type: 'success',
        }));
      }

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
      <DialogTitle>{isEditMode ? 'Редактировать товар' : 'Добавить новый товар'}</DialogTitle>
      
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
            {isSubmitting ? <CircularProgress size={24} /> : (isEditMode ? 'Сохранить' : 'Добавить')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddProductModal;
