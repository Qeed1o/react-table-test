import { useEffect } from 'react';
import { Snackbar, Alert, type AlertProps } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { hideToast } from '../store/slices/toastSlice';

const Toast = () => {
  const dispatch = useAppDispatch();
  const { message, type, isVisible } = useAppSelector((state) => state.toast);

  const handleClose = () => {
    dispatch(hideToast());
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  const getAlertSeverity = (): AlertProps['severity'] => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'info':
      default:
        return 'info';
    }
  };

  return (
    <Snackbar
      open={isVisible}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={getAlertSeverity()}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
