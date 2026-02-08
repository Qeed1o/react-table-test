import { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, CircularProgress } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useProducts } from '../hooks/useProducts';

const SearchBar = () => {
  const { search, changeSearch, isLoading } = useProducts();
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearch !== search) {
        changeSearch(localSearch);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localSearch, search, changeSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  return (
    <Box mb={3}>
      <TextField
        fullWidth
        variant="outlined"
        value={localSearch}
        onChange={handleChange}
        autoComplete='off'
        placeholder="Поиск по названию, артикулу или вендору"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {isLoading ? (
                <CircularProgress size={20} sx={{ color: '#9E9E9E' }} />
              ) : (
                <SearchIcon sx={{ color: '#9E9E9E' }} />
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FAFAFA',
            borderRadius: 2,
            '& fieldset': {
              borderColor: '#E0E0E0',
            },
            '&:hover fieldset': {
              borderColor: '#BDBDBD',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976D2',
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
