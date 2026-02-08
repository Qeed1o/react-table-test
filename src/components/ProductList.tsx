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
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useState } from 'react';
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
}

const ProductList = ({ 
  products, 
  pagination, 
  onPageChange, 
  isLoading
}: ProductListProps) => {
  
  const getRatingColor = (rating: number) => {
    return rating < 3 ? '#E53935' : '#424242';
  };

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

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
                <Checkbox 
                  size="small"
                  checked={selectedRows.size === products.length && products.length > 0}
                  indeterminate={selectedRows.size > 0 && selectedRows.size < products.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(new Set(products.map(p => p.id)));
                    } else {
                      setSelectedRows(new Set());
                    }
                  }}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#757575' }}>Наименование</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#757575' }}>Вендор</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#757575' }}>Артикул</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#757575' }}>Оценка</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#757575' }}>Цена, Р</TableCell>
              <TableCell /> {/* For action buttons */}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow 
                key={product.id} 
                hover
                sx={{
                  borderLeft: selectedRows.has(product.id) ? '3px solid #1976D2' : '3px solid transparent',
                  '&:hover': {
                    backgroundColor: '#FAFAFA'
                  }
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox 
                    size="small"
                    checked={selectedRows.has(product.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedRows);
                      if (e.target.checked) {
                        newSelected.add(product.id);
                      } else {
                        newSelected.delete(product.id);
                      }
                      setSelectedRows(newSelected);
                    }}
                  />
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
                      <Typography variant="body2" fontWeight={600}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="#757575">
                        {product.category}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{product.vendor}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" minWidth="max-content">
                    <Typography 
                      color={getRatingColor(product.rating)}
                      fontWeight={500}
                    >
                      {product.rating.toFixed(1)}
                    </Typography>
                    <Typography 
                      color="text.secondary"
                      fontWeight={500}
                    >/5
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="baseline">
                    <Typography>
                      {Math.floor(product.price).toLocaleString()},
                    </Typography>
                    <Typography variant="body2" color="#757575">
                      {(product.price % 1).toFixed(2).substring(2)}
                    </Typography>
                  </Box>
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
          
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton 
              size="small"
              onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
              sx={{ 
                border: '1px solid #e0e0e0',
                '&:hover': { backgroundColor: '#f5f5f5' },
                '&:disabled': { backgroundColor: '#f5f5f5' }
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>
            
            {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.limit)) }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === pagination.page ? "contained" : "outlined"}
                size="small"
                onClick={() => onPageChange(pageNum)}
                sx={{ 
                  minWidth: 32, 
                  height: 32, 
                  p: 0,
                  backgroundColor: pageNum === pagination.page ? '#1976D2' : 'transparent',
                  borderColor: '#e0e0e0',
                  color: pageNum === pagination.page ? 'white' : '#424242',
                  '&:hover': {
                    backgroundColor: pageNum === pagination.page ? '#1565C0' : '#f5f5f5'
                  }
                }}
              >
                {pageNum}
              </Button>
            ))}
            
            <IconButton 
              size="small"
              onClick={() => onPageChange(Math.min(Math.ceil(pagination.total / pagination.limit), pagination.page + 1))}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              sx={{ 
                border: '1px solid #e0e0e0',
                '&:hover': { backgroundColor: '#f5f5f5' },
                '&:disabled': { backgroundColor: '#f5f5f5' }
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>
        </Box>
    </Box>
  );
};

export default ProductList;
