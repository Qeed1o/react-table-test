import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  minHeight?: string | number;
}

export const LoadingSpinner = React.memo<LoadingSpinnerProps>(({ 
  size = 40, 
  message, 
  minHeight = '60vh' 
}) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      minHeight={minHeight}
      gap={2}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';
