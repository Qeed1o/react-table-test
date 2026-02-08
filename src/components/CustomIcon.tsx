import Box from '@mui/material/Box';

interface CustomIconProps {
  color?: string;
}

const CustomIcon = ({ color = '#1976d2' }: CustomIconProps) => {
  return (
    <Box
      component="img"
      src="/src/assets/logo.svg"
      alt="Logo"
      sx={{
        width: 52,
        height: 52,
        padding: '10px',
        background: 'linear-gradient(360deg, rgba(35, 35, 35, 0) 50%, rgba(35, 35, 35, 0.06) 100%)',
        boxShadow: '0px 12px 8px 0px rgba(0,0,0,0.03)',
        borderRadius: '50%',
        filter: color !== '#000000' ? `brightness(0) saturate(100%) hue-rotate(${getHueRotation(color)}deg)` : 'none',
      }}
    />
  );
};

// Вспомогательная функция для преобразования цвета в hue-rotate
const getHueRotation = (color: string): number => {
  const colorMap: Record<string, number> = {
    '#1976d2': 207, // синий
    '#dc004e': 340, // красный
    '#4caf50': 120, // зеленый
    '#ff9800': 40,  // оранжевый
  };
  return colorMap[color] || 0;
};

export default CustomIcon;
