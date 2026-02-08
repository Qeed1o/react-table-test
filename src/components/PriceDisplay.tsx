import { Box, Typography } from '@mui/material';
import { memo } from 'react';

interface PriceDisplayProps {
  price: number;
}

const PriceDisplay = memo(({ price }: PriceDisplayProps) => {
  const formatPrice = (price: number) => {
    const integerPart = Math.floor(price).toLocaleString();
    const decimalPart = (price % 1).toFixed(2).substring(2);
    return { integerPart, decimalPart };
  };

  const { integerPart, decimalPart } = formatPrice(price);

  return (
    <Box display="flex" alignItems="baseline">
      <Typography>
        {integerPart},
      </Typography>
      <Typography variant="body2" color="#757575">
        {decimalPart}
      </Typography>
    </Box>
  );
});

export default PriceDisplay;
