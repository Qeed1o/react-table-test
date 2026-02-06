import { useState, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setSearch } from '../store/slices/productsSlice';

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.products.search);
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearch !== search) {
        dispatch(setSearch(localSearch));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localSearch, search, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  return (
    <Box mb={3}>
      <TextField
        fullWidth
        label="Поиск товаров"
        variant="outlined"
        value={localSearch}
        onChange={handleChange}
        placeholder="Введите название, артикул или вендор..."
      />
    </Box>
  );
};

export default SearchBar;
