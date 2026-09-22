import type { CellStyle } from "@/types/cell-style";

export const useItalic = (
  cellStyle: CellStyle,
  updateCellStyle: (patch: Partial<CellStyle>) => void,
) => {
  const onItalicClick = () => {
    updateCellStyle({
      italic: !cellStyle.italic,
    });
  };

  return {
    onItalicClick,
  };
};
