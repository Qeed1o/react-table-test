import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductsState, Product } from '../../types';
import { productsApi } from '../../api/productsApi';
import { PAGINATION } from '../../constants';

export const fetchProductsAsync = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, limit, search, sortBy, order }: { 
    page: number; 
    limit: number; 
    search: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) => {
    const skip = (page - 1) * limit;
    const response = await productsApi.getProducts({
      limit,
      skip,
      search: search || undefined,
      sortBy: sortBy || undefined,
      order: order || undefined,
    });
    return response;
  }
);

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total: 0,
  },
  sorting: {
    field: 'name',
    direction: 'asc',
  },
  search: '',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setSorting: (state, action: PayloadAction<{field: keyof Product; direction: 'asc' | 'desc'}>) => {
      state.sorting = action.payload;
      state.search = ''; // Очищаем поиск при сортировке
      state.pagination.page = 1; // Сбрасываем страницу
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.pagination.page = 1; // Сброс страницы при поиске
      // Сбрасываем сортировку при поиске
      state.sorting = {
        field: 'name',
        direction: 'asc',
      };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload);
      state.pagination.total += 1;
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки товаров';
      });
  },
});

export const { setPage, setSorting, setSearch, setLoading, addProduct, updateProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;
