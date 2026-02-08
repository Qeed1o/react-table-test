import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AddProductModalState } from '../../types';

const initialState: AddProductModalState = {
  isOpen: false,
  isSubmitting: false,
  error: null,
  isEditMode: false,
  editingProductId: null,
};

const addProductModalSlice = createSlice({
  name: 'addProductModal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
      state.error = null;
      state.isEditMode = false;
      state.editingProductId = null;
    },
    openEditModal: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.error = null;
      state.isEditMode = true;
      state.editingProductId = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.error = null;
      state.isEditMode = false;
      state.editingProductId = null;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { openModal, openEditModal, closeModal, setSubmitting, setError, clearError } = addProductModalSlice.actions;
export default addProductModalSlice.reducer;
