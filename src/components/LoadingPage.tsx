import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <CircularProgress 
        size={60} 
        thickness={4}
        sx={{ 
          color: '#1976d2',
          mb: 3,
        }} 
      />
      <Typography 
        variant="h6" 
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        Загрузка...
      </Typography>
    </Box>
  );
};

export default LoadingPage;
