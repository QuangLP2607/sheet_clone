import type { CellKey } from "@/features/spreadsheet/types";

interface HandleEnterKeyParams {
  activeCellKey: CellKey;
  startEditing: (cellKey: CellKey) => void;
}

export function handleEnterKey({
  activeCellKey,
  startEditing,
}: HandleEnterKeyParams): boolean {
  startEditing(activeCellKey);

  return true;
}
