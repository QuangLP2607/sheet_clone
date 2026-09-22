import type { CellStyle } from "@/types/cell-style";

export const useColor = (
  updateCellStyle: (patch: Partial<CellStyle>) => void,
) => {
  const onColorChange = (color: string) => {
    updateCellStyle({ color });
  };

  return {
    onColorChange,
  };
};
