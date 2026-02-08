import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Typography,
  Checkbox,
  IconButton,
} from '@mui/material';
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useState, memo, useMemo } from 'react';
import type { Product } from '../types';
import ProductInfo from './ProductInfo';
import RatingDisplay from './RatingDisplay';
import PriceDisplay from './PriceDisplay';
import PaginationButton from './PaginationButton';

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

// Стили для таблицы
const tableHeaderStyles = {
  fontWeight: 600,
  color: '#757575' as const,
};

const selectedRowStyles = {
  borderLeft: '3px solid #1976D2',
};

const hoverRowStyles = {
  backgroundColor: '#FAFAFA',
};

const paginationButtonStyles = {
  border: '1px solid #e0e0e0',
  '&:hover': { backgroundColor: '#f5f5f5' },
  '&:disabled': { backgroundColor: '#f5f5f5' },
};

const ProductList = memo(({ 
  products, 
  pagination, 
  onPageChange, 
  isLoading
}: ProductListProps) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Мемоизированные вычисления
  const paginationInfo = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit + 1;
    const endIndex = Math.min(pagination.page * pagination.limit, pagination.total);
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    
    return { startIndex, endIndex, totalPages };
  }, [pagination.page, pagination.limit, pagination.total]);

  const pageNumbers = useMemo(() => {
    return Array.from(
      { length: Math.min(5, paginationInfo.totalPages) }, 
      (_, i) => i + 1
    );
  }, [paginationInfo.totalPages]);

  // Обработчики событий
  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? new Set(products.map(p => p.id)) : new Set());
  };

  const handleSelectRow = (productId: string, checked: boolean) => {
    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(productId);
      } else {
        newSelected.delete(productId);
      }
      return newSelected;
    });
  };

  const handlePrevPage = () => {
    onPageChange(Math.max(1, pagination.page - 1));
  };

  const handleNextPage = () => {
    onPageChange(Math.min(paginationInfo.totalPages, pagination.page + 1));
  };

  // Вспомогательные функции больше не нужны здесь, так как они вынесены в компоненты

  const isAllSelected = products.length > 0 && selectedRows.size === products.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < products.length;

  return (
    <Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox 
                  size="small"
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell sx={tableHeaderStyles}>Наименование</TableCell>
              <TableCell sx={tableHeaderStyles}>Вендор</TableCell>
              <TableCell sx={tableHeaderStyles}>Артикул</TableCell>
              <TableCell sx={tableHeaderStyles}>Оценка</TableCell>
              <TableCell sx={tableHeaderStyles}>Цена, &#x20BD;</TableCell>
              <TableCell /> {/* For action buttons */}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow 
                key={product.id} 
                hover
                sx={{
                  borderLeft: selectedRows.has(product.id) 
                    ? selectedRowStyles.borderLeft 
                    : '3px solid transparent',
                  '&:hover': hoverRowStyles,
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox 
                    size="small"
                    checked={selectedRows.has(product.id)}
                    onChange={(e) => handleSelectRow(product.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  <ProductInfo product={product} />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{product.vendor}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>
                  <RatingDisplay rating={product.rating} />
                </TableCell>
                <TableCell>
                  <PriceDisplay price={product.price} />
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
      
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mt={2}
          px={1}
        >
          <Typography variant="body2" color="text.secondary">
            Показано {paginationInfo.startIndex}-{paginationInfo.endIndex} из {pagination.total}
          </Typography>
          
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton 
              size="small"
              onClick={handlePrevPage}
              disabled={pagination.page === 1}
              sx={paginationButtonStyles}
            >
              <NavigateBeforeIcon />
            </IconButton>
            
            {pageNumbers.map((pageNum) => (
              <PaginationButton
                key={pageNum}
                pageNum={pageNum}
                currentPage={pagination.page}
                onPageChange={onPageChange}
              />
            ))}
            
            <IconButton 
              size="small"
              onClick={handleNextPage}
              disabled={pagination.page >= paginationInfo.totalPages}
              sx={paginationButtonStyles}
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>
        </Box>
    </Box>
  );
});

export default ProductList;
