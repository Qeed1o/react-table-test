import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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

const AddProductModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, isSubmitting, error } = useAppSelector((state) => state.addProductModal);

  const [formData, setFormData] = useState<AddProductForm>({
    name: '',
    price: '',
    vendor: '',
    sku: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<AddProductForm>>({});

  useEffect(() => {
    if (!isOpen) {
      // Сброс формы при закрытии
      setFormData({
        name: '',
        price: '',
        vendor: '',
        sku: '',
      });
      setFieldErrors({});
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  const validateForm = (): boolean => {
    const errors: Partial<AddProductForm> = {};

    if (!formData.name.trim()) {
      errors.name = 'Наименование обязательно';
    }

    if (!formData.price.trim()) {
      errors.price = 'Цена обязательна';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = 'Цена должна быть положительным числом';
    }

    if (!formData.vendor.trim()) {
      errors.vendor = 'Вендор обязателен';
    }

    if (!formData.sku.trim()) {
      errors.sku = 'Артикул обязателен';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(setSubmitting(true));
      dispatch(clearError());

      // Создание нового товара
      const newProduct: Product = {
        id: `product-${Date.now()}`,
        name: formData.name.trim(),
        price: Number(formData.price),
        vendor: formData.vendor.trim(),
        sku: formData.sku.trim(),
        rating: Math.floor(Math.random() * 5) + 1, // Случайный рейтинг 1-5
      };

      // Добавление товара в store
      dispatch(addProduct(newProduct));

      // Показ уведомления об успехе
      dispatch(showToast({
        message: 'Товар успешно добавлен',
        type: 'success',
      }));

      // Закрытие модального окна
      dispatch(closeModal());
    } catch {
      dispatch(setError('Ошибка при добавлении товара'));
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      dispatch(closeModal());
    }
  };

  const handleInputChange = (field: keyof AddProductForm) => (
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
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={{
        enter: 300,
        exit: 200,
      }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          animation: 'slideIn 0.3s ease-out',
        },
      }}
    >
      <DialogTitle>Добавить новый товар</DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Наименование"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
              disabled={isSubmitting}
              fullWidth
            />

            <TextField
              label="Цена"
              value={formData.price}
              onChange={handleInputChange('price')}
              error={!!fieldErrors.price}
              helperText={fieldErrors.price}
              disabled={isSubmitting}
              fullWidth
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              label="Вендор"
              value={formData.vendor}
              onChange={handleInputChange('vendor')}
              error={!!fieldErrors.vendor}
              helperText={fieldErrors.vendor}
              disabled={isSubmitting}
              fullWidth
            />

            <TextField
              label="Артикул"
              value={formData.sku}
              onChange={handleInputChange('sku')}
              error={!!fieldErrors.sku}
              helperText={fieldErrors.sku}
              disabled={isSubmitting}
              fullWidth
            />

            {error && (
              <Box color="error.main" fontSize="0.875rem">
                {error}
              </Box>
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
