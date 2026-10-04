import { memo, useCallback, type MouseEvent } from "react";

import { useShallow } from "zustand/react/shallow";

import classNames from "classnames/bind";

import Cell from "@/features/spreadsheet/components/Cell";

import {
  DEFAULT_CELL_CONTENT,
  DEFAULT_CELL_STYLE,
} from "@/features/spreadsheet/types";

import type { CellKey } from "@/features/spreadsheet/types";

import { useDataStore } from "@/features/spreadsheet/stores/dataStore";
import { useSelectionStore } from "@/features/spreadsheet/stores/selectionStore";

import CellValue from "./CellValue";

import { getCellKey } from "../../../../utils/cellAddress";

import styles from "./CellContainer.module.scss";

const cx = classNames.bind(styles);

interface CellContainerProps {
  rowIndex: number;
  columnIndex: number;
}

function CellContainer({ rowIndex, columnIndex }: CellContainerProps) {
  const cellKey = getCellKey(rowIndex, columnIndex) as CellKey;

  const cell = useDataStore((state) => state.cells[cellKey]);

  const { selected, editing } = useSelectionStore(
    useShallow((state) => ({
      selected: state.activeCellKey === cellKey,

      editing:
        state.editingCellKey === cellKey && state.editingTarget === "cell",
    })),
  );

  const selectCell = useSelectionStore((state) => state.selectCell);

  const startEditing = useSelectionStore((state) => state.startEditing);

  const content = cell?.content ?? DEFAULT_CELL_CONTENT;

  const cellStyle = cell?.style ?? DEFAULT_CELL_STYLE;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      if (editing) {
        return;
      }

      selectCell(cellKey);
    },
    [cellKey, editing, selectCell],
  );

  const handleDoubleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      if (editing) {
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();

      startEditing(cellKey, "cell", {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });
    },
    [cellKey, editing, startEditing],
  );

  return (
    <div
      className={cx("cellWrapper", {
        selected,
        editing,
      })}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <Cell
        className={styles.cell}
        style={cellStyle}
        selected={selected}
        editing={editing}
      >
        <div className={styles.value}>
          <CellValue content={content} />
        </div>
      </Cell>
    </div>
  );
}

export default memo(CellContainer);
