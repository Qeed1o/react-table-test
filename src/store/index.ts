import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import productsSlice from './slices/productsSlice';
import addProductModalSlice from './slices/addProductModalSlice';
import toastSlice from './slices/toastSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productsSlice,
    addProductModal: addProductModalSlice,
    toast: toastSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
