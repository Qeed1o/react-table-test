import { Box, Typography, Avatar } from '@mui/material';
import { memo } from 'react';
import type { Product } from '../types';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo = memo(({ product }: ProductInfoProps) => (
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
));

export default ProductInfo;
