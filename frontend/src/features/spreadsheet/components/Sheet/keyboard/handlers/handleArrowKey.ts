import type { CellKey } from "@/features/spreadsheet/types";

type ArrowKey = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

interface HandleArrowKeyParams {
  key: ArrowKey;
  activeCellKey: CellKey;
  totalRows: number;
  totalCols: number;

  moveCell: (
    rowIndex: number,
    columnIndex: number,
    rowDelta: number,
    columnDelta: number,
    totalRows: number,
    totalCols: number,
  ) => void;
}

export function handleArrowKey({
  key,
  activeCellKey,
  totalRows,
  totalCols,
  moveCell,
}: HandleArrowKeyParams): boolean {
  let rowDelta = 0;
  let columnDelta = 0;

  switch (key) {
    case "ArrowUp":
      rowDelta = -1;
      break;

    case "ArrowDown":
      rowDelta = 1;
      break;

    case "ArrowLeft":
      columnDelta = -1;
      break;

    case "ArrowRight":
      columnDelta = 1;
      break;
  }

  const [rowIndex, columnIndex] = activeCellKey.split(":").map(Number);

  moveCell(rowIndex, columnIndex, rowDelta, columnDelta, totalRows, totalCols);

  return true;
}
