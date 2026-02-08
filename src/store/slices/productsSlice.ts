import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductsState, Product } from '../../types';

// Real API call для получения товаров
const fetchProductsFromAPI = async (page: number, limit: number, search: string): Promise<{products: Product[], total: number}> => {
  try {
    const skip = (page - 1) * limit;
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    
    if (search) {
      url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    // Transform API data to our Product interface
    const products: Product[] = data.products.map((item: {
      id: number;
      title?: string;
      name?: string;
      price: number;
      brand?: string;
      sku?: string;
      rating?: number;
      description?: string;
      thumbnail?: string;
      images?: string[];
      category?: string;
    }) => ({
      id: item.id.toString(),
      name: item.title || item.name || 'Unknown Product',
      price: item.price,
      vendor: item.brand || '-',
      sku: item.sku || `SKU-${item.id}`,
      rating: item.rating || 0,
      description: item.description,
      image: item.thumbnail || item.images?.[0],
      category: item.category,
    }));

    return {
      products,
      total: data.total || data.products?.length || 0,
    };
  } catch (error) {
    console.error('API Error:', error);
    // Fallback to mock data if API fails
    const mockProducts: Product[] = Array.from({ length: 100 }, (_, i) => ({
      id: `product-${i + 1}`,
      name: `Товар ${i + 1}`,
      price: Math.floor(Math.random() * 10000) + 100,
      vendor: `Вендор ${(i % 5) + 1}`,
      sku: `SKU-${String(i + 1).padStart(4, '0')}`,
      rating: Math.floor(Math.random() * 5) + 1,
      description: `Описание товара ${i + 1}`,
      image: `https://picsum.photos/seed/product${i + 1}/48/48.jpg`,
      category: `Категория ${(i % 8) + 1}`,
    }));

    const filteredProducts = search 
      ? mockProducts.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase()) ||
          p.vendor.toLowerCase().includes(search.toLowerCase())
        )
      : mockProducts;

    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    return {
      products: paginatedProducts,
      total: filteredProducts.length,
    };
  }
};

export const fetchProductsAsync = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, limit, search }: { page: number; limit: number; search: string }) => {
    const response = await fetchProductsFromAPI(page, limit, search);
    return response;
  }
);

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
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
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.pagination.page = 1; // Сброс страницы при поиске
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.unshift(action.payload);
      state.pagination.total += 1;
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
        state.products = [];
      });
  },
});

export const { setPage, setSorting, setSearch, setLoading, addProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;
