import type { CellStyle } from "@/types/cell-style";

export const useHorizontalAlign = (
  updateCellStyle: (patch: Partial<CellStyle>) => void,
) => {
  const onHorizontalAlignChange = (
    horizontalAlign: CellStyle["horizontalAlign"],
  ) => {
    updateCellStyle({
      horizontalAlign,
    });
  };

  return {
    onHorizontalAlignChange,
  };
};
