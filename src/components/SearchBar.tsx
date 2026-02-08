import { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useProducts } from '../hooks/useProducts';

const SearchBar = () => {
  const { search, changeSearch } = useProducts();
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
        placeholder="Поиск по названию, артикулу или вендору"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#9E9E9E' }} />
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
