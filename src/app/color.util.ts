const HEX_RADIX = 16;
const RGB_CHANNEL_MASK = 255;
const GREEN_CHANNEL_SHIFT = 8;
const RED_CHANNEL_SHIFT = 16;
const LUMINANCE_WEIGHTS = { blue: 0.114, green: 0.587, red: 0.299 };
const LUMINANCE_THRESHOLD = 145;

export function getContrastInk(color: string): string {
  const rgb = Number.parseInt(color.slice(1), HEX_RADIX);
  const red = (rgb >> RED_CHANNEL_SHIFT) & RGB_CHANNEL_MASK;
  const green = (rgb >> GREEN_CHANNEL_SHIFT) & RGB_CHANNEL_MASK;
  const blue = rgb & RGB_CHANNEL_MASK;
  const luminance = red * LUMINANCE_WEIGHTS.red + green * LUMINANCE_WEIGHTS.green + blue * LUMINANCE_WEIGHTS.blue;

  return luminance > LUMINANCE_THRESHOLD ? '#20251e' : '#ffffff';
}
