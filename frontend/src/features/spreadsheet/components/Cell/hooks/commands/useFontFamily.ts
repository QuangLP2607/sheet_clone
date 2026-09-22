import type { CellStyle } from "@/types/cell-style";

export const useFontFamily = (
  updateCellStyle: (patch: Partial<CellStyle>) => void,
) => {
  const onFontFamilyChange = (fontFamily: string | null) => {
    updateCellStyle({
      fontFamily,
    });
  };

  return {
    onFontFamilyChange,
  };
};
