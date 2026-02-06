import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
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
  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage + 1);
  };

  const getRatingColor = (rating: number) => {
    return rating < 3 ? 'error.main' : 'text.primary';
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Наименование</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Вендор</TableCell>
              <TableCell>Артикул</TableCell>
              <TableCell>Рейтинг</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price.toLocaleString()} ₽</TableCell>
                <TableCell>{product.vendor}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>
                  <Typography color={getRatingColor(product.rating)}>
                    {product.rating}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box display="flex" justifyContent="center" p={2}>
                    <CircularProgress size={24} />
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
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
      
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={pagination.total}
        rowsPerPage={pagination.limit}
        page={pagination.page - 1}
        onPageChange={handleChangePage}
        labelRowsPerPage="Товаров на странице:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} из ${count !== -1 ? count : `более ${to}`}`
        }
      />
    </Box>
  );
};

export default ProductList;
