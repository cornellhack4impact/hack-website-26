/**
 * Generates a 1x1 pixel base64 image data URL for a specific hex color.
 * Used to create a solid color texture for the globe surface (water).
 */
export const getSolidColorTexture = (color: string): string => {
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return canvas.toDataURL('image/png');
  }
  
  return '';
};

// Hex codes defined in requirements
export const LAND_COLOR = '#41A67E';
export const WATER_COLOR = '#1055C9';
export const LAND_SIDE_COLOR = '#2C7A59'; // Slightly darker version of land for 3D extrusion effect
