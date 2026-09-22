import type { CellStyle } from "@/types/cell-style";

export const useStrike = (
  cellStyle: CellStyle,
  updateCellStyle: (patch: Partial<CellStyle>) => void,
) => {
  const onStrikeClick = () => {
    updateCellStyle({
      strike: !cellStyle.strike,
    });
  };

  return {
    onStrikeClick,
  };
};
