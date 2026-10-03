import { forwardRef, memo, useMemo, useRef, useState } from "react";

import type { PointerEvent } from "react";

import {
  VariableSizeGrid as Grid,
  areEqual,
  type GridChildComponentProps,
} from "react-window";

import classNames from "classnames/bind";

import { DEFAULT_COLUMN_WIDTH } from "@/features/spreadsheet/types";

import { useSelectionStore } from "@/features/spreadsheet/stores/selectionStore";
import { useSizeStore } from "@/features/spreadsheet/stores/sizeStore";

import { getColumnLabel } from "@/features/spreadsheet/utils/cellAddress";

import styles from "./ColumnHeaders.module.scss";

const cx = classNames.bind(styles);

const RESIZE_EDGE_SIZE = 6;

interface ColumnHeadersProps {
  totalCols: number;
  width: number;
  height: number;

  onColumnResize: (columnIndex: number, width: number) => void;

  onResizePreview: (clientX: number) => void;

  onResizeEnd: () => void;
}

interface HeaderItemData {
  onColumnResize: (columnIndex: number, width: number) => void;

  onResizePreview: (clientX: number) => void;

  onResizeEnd: () => void;
}

const ColumnHeaderCell = memo(function ColumnHeaderCell({
  columnIndex,
  style,
  data,
}: GridChildComponentProps<HeaderItemData>) {
  const columnWidth = useSizeStore(
    (state) => state.columnWidths[columnIndex] ?? DEFAULT_COLUMN_WIDTH,
  );

  const activeCellKey = useSelectionStore((state) => state.activeCellKey);

  const selectedColumnIndex = activeCellKey
    ? Number(activeCellKey.split(":")[1])
    : null;

  const isSelected = selectedColumnIndex === columnIndex;

  const startXRef = useRef(0);
  const startWidthRef = useRef(columnWidth);
  const startRightRef = useRef(0);

  const [isResizing, setIsResizing] = useState(false);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();

    if (event.clientX < rect.right - RESIZE_EDGE_SIZE) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    startXRef.current = event.clientX;
    startWidthRef.current = columnWidth;
    startRightRef.current = rect.right;

    element.setPointerCapture(event.pointerId);

    setIsResizing(true);

    data.onResizePreview(rect.right);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget;

    if (!element.hasPointerCapture(event.pointerId)) {
      return;
    }

    const delta = event.clientX - startXRef.current;

    const nextWidth = Math.max(40, startWidthRef.current + delta);

    const nextX = startRightRef.current + (nextWidth - startWidthRef.current);

    data.onResizePreview(nextX);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget;

    if (!element.hasPointerCapture(event.pointerId)) {
      return;
    }

    const delta = event.clientX - startXRef.current;

    const nextWidth = Math.max(40, startWidthRef.current + delta);

    element.releasePointerCapture(event.pointerId);

    setIsResizing(false);

    data.onColumnResize(columnIndex, nextWidth);

    data.onResizeEnd();
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget;

    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }

    setIsResizing(false);

    data.onResizeEnd();
  };

  return (
    <div
      style={style}
      className={cx("cell", {
        "cell--selected": isSelected,
        "cell--resizing": isResizing,
      })}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <span>{getColumnLabel(columnIndex)}</span>
    </div>
  );
}, areEqual);

ColumnHeaderCell.displayName = "ColumnHeaderCell";

const ColumnHeaders = forwardRef<Grid, ColumnHeadersProps>(
  function ColumnHeaders(
    { totalCols, width, height, onColumnResize, onResizePreview, onResizeEnd },
    ref,
  ) {
    const getColumnWidth = useSizeStore((state) => state.getColumnWidth);

    const itemData = useMemo<HeaderItemData>(
      () => ({
        onColumnResize,
        onResizePreview,
        onResizeEnd,
      }),
      [onColumnResize, onResizePreview, onResizeEnd],
    );

    return (
      <Grid
        ref={ref}
        className={cx("grid")}
        columnCount={totalCols}
        columnWidth={getColumnWidth}
        height={height}
        rowCount={1}
        rowHeight={() => height}
        width={width}
        itemData={itemData}
        overscanColumnCount={1}
        overscanRowCount={0}
      >
        {ColumnHeaderCell}
      </Grid>
    );
  },
);

ColumnHeaders.displayName = "ColumnHeaders";

export default ColumnHeaders;
