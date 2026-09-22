import type { CellStyle } from "@/types/cell-style";

export const useTextWrapping = (
  updateCellStyle: (patch: Partial<CellStyle>) => void,
) => {
  const onTextWrappingChange = (textWrapping: CellStyle["textWrapping"]) => {
    updateCellStyle({
      textWrapping,
    });
  };

  return {
    onTextWrappingChange,
  };
};
