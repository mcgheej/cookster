/**
 *
 * @param color - base colour in hex format #RRGGBB
 * @param opacity - opacity 0 to 1
 * @returns - new colour in hex format #RRGGBB
 */
export function opaqueColor(color: string, opacity: number): string {
  const r = getDecimalByteFromHex(color.substring(1, 3));
  const g = getDecimalByteFromHex(color.substring(3, 5));
  const b = getDecimalByteFromHex(color.substring(5, 7));
  if (r < 0 || g < 0 || b < 0) {
    return color;
  }
  const newR = Math.round(255 - opacity * (255 - r));
  const newG = Math.round(255 - opacity * (255 - g));
  const newB = Math.round(255 - opacity * (255 - b));
  return getHexRGB(newR, newG, newB);
}

export function getHexRGB(r: number, g: number, b: number): string {
  return '#' + getHexByte(r) + getHexByte(g) + getHexByte(b);
}

export function getHexByte(n: number): string {
  if (n < 0 || n > 255) {
    return '';
  }
  const result = n.toString(16);
  if (result.length === 2) {
    return result;
  }
  if (result.length === 1) {
    return '0' + result;
  }
  return '00';
}

export function getDecimalByteFromHex(hex: string): number {
  if (hex.length !== 2) {
    return -1;
  }
  const value = parseInt(hex, 16);
  return isNaN(value) ? -1 : value;
}
