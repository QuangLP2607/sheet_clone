import { useCallback, useState } from "react";

import type { CellStyle } from "@/types/cell-style";

const DEFAULT_CELL_STYLE: CellStyle = {
  bold: false,
  italic: false,
  strike: false,

  fontFamily: null,
  fontSize: 14,
  color: "#000000",

  fillColor: "#ffffff",

  horizontalAlign: "left",
  verticalAlign: "bottom",

  textWrapping: "overflow",
};

export const useCellStyle = () => {
  const [cellStyle, setCellStyle] = useState<CellStyle>(DEFAULT_CELL_STYLE);

  const updateCellStyle = useCallback((patch: Partial<CellStyle>) => {
    setCellStyle((prev) => ({
      ...prev,
      ...patch,
    }));
  }, []);

  return {
    cellStyle,
    updateCellStyle,
  };
};
