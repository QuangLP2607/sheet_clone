import type { CellStyle } from "@/types/cell-style";

export const useBold = (
  cellStyle: CellStyle,
  updateCellStyle: (patch: Partial<CellStyle>) => void,
) => {
  const onBoldClick = () => {
    updateCellStyle({
      bold: !cellStyle.bold,
    });
  };

  return {
    onBoldClick,
  };
};
