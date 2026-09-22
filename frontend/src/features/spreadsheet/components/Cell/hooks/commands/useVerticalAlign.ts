import type { CellStyle } from "@/types/cell-style";

export const useVerticalAlign = (
  updateCellStyle: (patch: Partial<CellStyle>) => void,
) => {
  const onVerticalAlignChange = (verticalAlign: CellStyle["verticalAlign"]) => {
    updateCellStyle({
      verticalAlign,
    });
  };

  return {
    onVerticalAlignChange,
  };
};
