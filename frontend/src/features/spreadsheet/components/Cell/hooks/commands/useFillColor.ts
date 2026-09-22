import type { CellStyle } from "@/types/cell-style";

export const useFillColor = (
  updateCellStyle: (patch: Partial<CellStyle>) => void,
) => {
  const onFillColorChange = (fillColor: string | null) => {
    updateCellStyle({ fillColor });
  };

  return {
    onFillColorChange,
  };
};
