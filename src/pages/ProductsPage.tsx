import { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch } from '../hooks/redux';
import { useProducts } from '../hooks/useProducts';
import { openModal } from '../store/slices/addProductModalSlice';
import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';
import AddProductModal from '../components/AddProductModal';

const ProductsPage = () => {
  const { 
    products, 
    isLoading, 
    error, 
    pagination, 
    fetchProducts,
    changePage
  } = useProducts();
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (newPage: number) => {
    changePage(newPage);
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
          onAddProduct={handleOpenAddModal}
        />
        
        <AddProductModal />
      </Box>
    </Container>
  );
};

export default ProductsPage;
