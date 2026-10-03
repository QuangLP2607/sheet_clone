import type { CellKey } from "@/features/spreadsheet/types";

interface StartEditingParams {
  activeCellKey: CellKey;
  startEditing: (cellKey: CellKey) => void;
}

export function startEditing({
  activeCellKey,
  startEditing: startEditingStore,
}: StartEditingParams): void {
  startEditingStore(activeCellKey);
}
