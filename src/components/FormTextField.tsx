import { TextField } from '@mui/material';
import { memo } from 'react';

interface FormTextFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  type?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const FormTextField = memo(({ 
  label, 
  value, 
  onChange, 
  error, 
  disabled, 
  type = 'text',
  inputProps 
}: FormTextFieldProps) => (
  <TextField
    label={label}
    value={value}
    onChange={onChange}
    error={!!error}
    helperText={error}
    disabled={disabled}
    fullWidth
    type={type}
    inputProps={inputProps}
  />
));

export default FormTextField;
