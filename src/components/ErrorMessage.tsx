import { Box } from '@mui/material';
import { memo } from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = memo(({ message }: ErrorMessageProps) => (
  <Box color="error.main" fontSize="0.875rem">
    {message}
  </Box>
));

export default ErrorMessage;
