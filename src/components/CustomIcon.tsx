import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { createColorFilter } from '../utils/iconUtils';

interface CustomIconProps {
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
  padding?: string;
  backgroundColor?: string;
  boxShadow?: string;
  borderRadius?: string;
  color?: string;
  sx?: SxProps<Theme>;
}

const CustomIcon = ({
  src = "/src/assets/logo.svg",
  width = 52,
  height = 52,
  alt = "Logo",
  padding = "10px",
  backgroundColor = 'linear-gradient(360deg, rgba(35, 35, 35, 0) 50%, rgba(35, 35, 35, 0.06) 100%)',
  boxShadow = '0px 12px 8px 0px rgba(0,0,0,0.03)',
  borderRadius = '50%',
  color,
  sx,
}: CustomIconProps) => {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width,
        height,
        padding,
        background: backgroundColor,
        boxShadow,
        borderRadius,
        filter: color ? createColorFilter(color) : undefined,
        ...sx,
      }}
    />
  );
};


export default CustomIcon;
