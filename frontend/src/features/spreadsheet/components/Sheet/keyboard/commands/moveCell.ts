import type { CellKey } from "@/features/spreadsheet/types";

interface MoveCellParams {
  activeCellKey: CellKey;
  rowDelta: number;
  columnDelta: number;
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

export function moveCell({
  activeCellKey,
  rowDelta,
  columnDelta,
  totalRows,
  totalCols,
  moveCell: moveCellStore,
}: MoveCellParams): void {
  const [rowIndex, columnIndex] = activeCellKey.split(":").map(Number);

  moveCellStore(
    rowIndex,
    columnIndex,
    rowDelta,
    columnDelta,
    totalRows,
    totalCols,
  );
}
