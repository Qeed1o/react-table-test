import { Button } from '@mui/material';
import { memo } from 'react';

interface PaginationButtonProps {
  pageNum: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationButton = memo(({ pageNum, currentPage, onPageChange }: PaginationButtonProps) => {
  const isActive = pageNum === currentPage;
  
  return (
    <Button
      variant={isActive ? "contained" : "outlined"}
      size="small"
      onClick={() => onPageChange(pageNum)}
      sx={{ 
        minWidth: 32, 
        height: 32, 
        p: 0,
        backgroundColor: isActive ? '#1976D2' : 'transparent',
        borderColor: '#e0e0e0',
        color: isActive ? 'white' : '#424242',
        '&:hover': {
          backgroundColor: isActive ? '#1565C0' : '#f5f5f5'
        }
      }}
    >
      {pageNum}
    </Button>
  );
});

export default PaginationButton;
