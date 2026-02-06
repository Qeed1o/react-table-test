import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AddProductModalState } from '../../types';

const initialState: AddProductModalState = {
  isOpen: false,
  isSubmitting: false,
  error: null,
};

const addProductModalSlice = createSlice({
  name: 'addProductModal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
      state.error = null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.error = null;
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

export const { openModal, closeModal, setSubmitting, setError, clearError } = addProductModalSlice.actions;
export default addProductModalSlice.reducer;
