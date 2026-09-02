import { useCallback } from "react";

import type { FontMetadata } from "../types";

const loadedFonts = new Set<string>();

export function useLoadFont() {
  const loadFont = useCallback(async (font: FontMetadata): Promise<boolean> => {
    if (loadedFonts.has(font.family)) {
      return true;
    }

    try {
      const fontFace = new FontFace(font.family, `url("${font.source}")`, {
        weight: "400",
        style: "normal",
        display: "swap",
      });

      await fontFace.load();

      document.fonts.add(fontFace);

      loadedFonts.add(font.family);

      return true;
    } catch (error) {
      console.error(`Failed to load font "${font.family}"`, error);

      return false;
    }
  }, []);

  return {
    loadFont,
  };
}
