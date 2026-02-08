// Вспомогательная функция для преобразования цвета в hue-rotate
export const getHueRotation = (color: string): number => {
  const colorMap: Record<string, number> = {
    '#1976d2': 207, // синий
    '#dc004e': 340, // красный
    '#4caf50': 120, // зеленый
    '#ff9800': 40,  // оранжевый
  };
  return colorMap[color] || 0;
};

// Утилита для создания фильтра на основе цвета
export const createColorFilter = (color: string): string => {
  if (color === '#000000') return 'none';
  return `brightness(0) saturate(100%) hue-rotate(${getHueRotation(color)}deg)`;
};
