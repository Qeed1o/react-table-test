import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './redux';
import { fetchProductsAsync, setPage, setSorting, setSearch, setLoading, addProduct, clearError } from '../store/slices/productsSlice';
import type { Product } from '../types';

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const { 
    products, 
    isLoading, 
    error, 
    pagination, 
    sorting,
    search 
  } = useAppSelector((state) => state.products);

  const fetchProducts = useCallback(
    (page?: number, limit?: number, searchQuery?: string) => {
      dispatch(setLoading(true));
      return dispatch(fetchProductsAsync({
        page: page || pagination.page,
        limit: limit || pagination.limit,
        search: searchQuery !== undefined ? searchQuery : search,
      }));
    },
    [dispatch, pagination.page, pagination.limit, search]
  );

  const changePage = useCallback(
    (page: number) => {
      dispatch(setPage(page));
    },
    [dispatch]
  );

  const changeSorting = useCallback(
    (field: keyof Product, direction: 'asc' | 'desc') => {
      dispatch(setSorting({ field, direction }));
    },
    [dispatch]
  );

  const changeSearch = useCallback(
    (searchQuery: string) => {
      dispatch(setSearch(searchQuery));
    },
    [dispatch]
  );

  const addNewProduct = useCallback(
    (product: Product) => {
      dispatch(addProduct(product));
    },
    [dispatch]
  );

  const clearProductsError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    products,
    isLoading,
    error,
    pagination,
    sorting,
    search,
    fetchProducts,
    changePage,
    changeSorting,
    changeSearch,
    addNewProduct,
    clearProductsError,
  };
};
