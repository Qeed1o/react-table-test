import { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
  IconButton,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
} from '@mui/icons-material';
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

  const handleRefresh = () => {
    fetchProducts();
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
        {/* Header with title and search */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Товары
          </Typography>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <SearchBar />
          </Box>
          <Box sx={{ width: 300 }} /> {/* Placeholder for balance */}
        </Box>

        {/* Section header with action buttons */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 500 }}>
            Все позиции
          </Typography>
          <Box display="flex" gap={1}>
            <IconButton 
              onClick={handleRefresh}
              disabled={isLoading}
              sx={{ 
                border: '1px solid #e0e0e0',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              <RefreshIcon />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddModal}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' }
              }}
            >
              Добавить
            </Button>
          </Box>
        </Box>

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
