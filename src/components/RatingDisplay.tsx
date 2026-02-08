import { Box, Typography } from '@mui/material';
import { memo } from 'react';

interface RatingDisplayProps {
  rating: number;
}

const RatingDisplay = memo(({ rating }: RatingDisplayProps) => {
  const getRatingColor = (rating: number): string => {
    return rating < 3 ? '#E53935' : '#424242';
  };

  return (
    <Box display="flex" alignItems="center" minWidth="max-content">
      <Typography 
        color={getRatingColor(rating)}
        fontWeight={500}
      >
        {rating.toFixed(1)}
      </Typography>
      <Typography 
        color="text.secondary"
        fontWeight={500}
      >
        /5
      </Typography>
    </Box>
  );
});

export default RatingDisplay;
