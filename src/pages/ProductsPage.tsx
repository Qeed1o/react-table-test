import { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchProductsAsync, setPage } from '../store/slices/productsSlice';
import { openModal } from '../store/slices/addProductModalSlice';
import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';
import AddProductModal from '../components/AddProductModal';

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const { 
    products, 
    isLoading, 
    error, 
    pagination, 
    search 
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsAsync({
      page: pagination.page,
      limit: pagination.limit,
      search,
    }));
  }, [dispatch, pagination.page, pagination.limit, search]);

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleOpenAddModal = () => {
    dispatch(openModal());
  };

  if (isLoading && products.length === 0) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Список товаров
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenAddModal}
            size="large"
          >
            Добавить товар
          </Button>
        </Box>

        <SearchBar />

        {error && (
          <Box mb={2}>
            <Typography color="error">
              {error}
            </Typography>
          </Box>
        )}

        <ProductList
          products={products}
          pagination={pagination}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
        
        <AddProductModal />
      </Box>
    </Container>
  );
};

export default ProductsPage;
