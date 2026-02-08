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
  width = 52,
  height = 52,
  alt,
  src,
  padding,
  backgroundColor,
  boxShadow,
  borderRadius,
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
