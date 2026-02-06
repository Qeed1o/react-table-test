import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { checkAuthAsync } from './store/slices/authSlice';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import Toast from './components/Toast';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AppContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthAsync());
  }, [dispatch]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/products" replace />} 
      />
      <Route 
        path="/products" 
        element={isAuthenticated ? <ProductsPage /> : <Navigate to="/login" replace />} 
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? "/products" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
          <Toast />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
