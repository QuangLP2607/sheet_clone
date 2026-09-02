export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export function cssRgbToRgb(color: string): RGB | null {
  const match = color.match(/^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);

  if (!match) {
    return null;
  }

  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (value: number) => value.toString(16).padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
