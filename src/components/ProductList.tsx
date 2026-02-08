import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Checkbox,
  IconButton,
  Avatar,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import type { Product } from '../types';

interface ProductListProps {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (page: number) => void;
  isLoading: boolean;
  onAddProduct?: () => void;
}

const ProductList = ({ 
  products, 
  pagination, 
  onPageChange, 
  isLoading,
  onAddProduct
}: ProductListProps) => {
  
  const getRatingColor = (rating: number) => {
    return rating < 3 ? '#E53935' : 'inherit';
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <Box>
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Наименование</TableCell>
              <TableCell>Вендор</TableCell>
              <TableCell>Артикул</TableCell>
              <TableCell>Оценка</TableCell>
              <TableCell>Цена, Р</TableCell>
              <TableCell align="right">
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton onClick={handleRefresh} size="small">
                    <RefreshIcon />
                  </IconButton>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={onAddProduct}
                    sx={{
                      backgroundColor: '#1976D2',
                      '&:hover': {
                        backgroundColor: '#1565C0'
                      }
                    }}
                  >
                    Добавить
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox size="small" />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar 
                      src={product.image} 
                      variant="rounded"
                      sx={{ width: 48, height: 48, bgcolor: '#F5F5F5' }}
                    >
                      <Box sx={{ color: '#9E9E9E', fontSize: 12 }}>IMG</Box>
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.category}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{product.vendor}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>
                  <Typography 
                    color={getRatingColor(product.rating)}
                    fontWeight={500}
                  >
                    {product.rating}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={500}>
                    {product.price.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                    <IconButton size="small" sx={{ color: '#1976D2' }}>
                      <AddIcon />
                    </IconButton>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Box display="flex" justifyContent="center" p={2}>
                    <CircularProgress size={24} />
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Box display="flex" justifyContent="center" p={4}>
                    <Typography color="text.secondary">
                      Товары не найдены
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mt={2}
        px={1}
      >
        <Typography variant="body2" color="text.secondary">
          Показано {startIndex}-{endIndex} из {pagination.total}
        </Typography>
        
        <Box display="flex" gap={1}>
          {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => i + 1).slice(0, 5).map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === pagination.page ? "contained" : "outlined"}
              size="small"
              onClick={() => onPageChange(pageNum)}
              sx={{ minWidth: 32, height: 32, p: 0 }}
            >
              {pageNum}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductList;
