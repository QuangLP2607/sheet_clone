/**
 * Get contrasting text/icon color for a HEX color.
 */
export function getContrastColor(hex: string): "#000" | "#fff" {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  const luminance = (r * 299 + g * 587 + b * 114) / 1000;

  return luminance > 150 ? "#000" : "#fff";
}
