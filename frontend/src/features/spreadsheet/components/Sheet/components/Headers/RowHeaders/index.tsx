import { forwardRef, memo, useMemo, useRef, useState } from "react";

import type { PointerEvent } from "react";

import {
  VariableSizeGrid as Grid,
  areEqual,
  type GridChildComponentProps,
} from "react-window";

import classNames from "classnames/bind";

import { DEFAULT_ROW_HEIGHT } from "@/features/spreadsheet/types";

import { useSelectionStore } from "@/features/spreadsheet/stores/selectionStore";
import { useSizeStore } from "@/features/spreadsheet/stores/sizeStore";

import styles from "./RowHeaders.module.scss";

const cx = classNames.bind(styles);

const RESIZE_EDGE_SIZE = 6;
const MIN_ROW_HEIGHT = 20;

interface RowHeadersProps {
  totalRows: number;
  width: number;
  height: number;

  onRowResize: (rowIndex: number, height: number) => void;
  onResizePreview: (clientY: number) => void;
  onResizeEnd: () => void;
}

interface HeaderItemData {
  onRowResize: (rowIndex: number, height: number) => void;
  onResizePreview: (clientY: number) => void;
  onResizeEnd: () => void;
}

const RowHeaderCell = memo(function RowHeaderCell({
  rowIndex,
  style,
  data,
}: GridChildComponentProps<HeaderItemData>) {
  const rowHeight = useSizeStore(
    (state) => state.rowHeights[rowIndex] ?? DEFAULT_ROW_HEIGHT,
  );

  const activeCellKey = useSelectionStore((state) => state.activeCellKey);

  const selectedRowIndex = activeCellKey
    ? Number(activeCellKey.split(":")[0])
    : null;

  const isSelected = selectedRowIndex === rowIndex;

  const startYRef = useRef(0);
  const startHeightRef = useRef(rowHeight);
  const startBottomRef = useRef(0);

  const [isResizing, setIsResizing] = useState(false);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    if (event.clientY < rect.bottom - RESIZE_EDGE_SIZE) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    startYRef.current = event.clientY;
    startHeightRef.current = rowHeight;
    startBottomRef.current = rect.bottom;

    event.currentTarget.setPointerCapture(event.pointerId);

    setIsResizing(true);

    data.onResizePreview(rect.bottom);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const delta = event.clientY - startYRef.current;

    const nextHeight = Math.max(MIN_ROW_HEIGHT, startHeightRef.current + delta);

    const nextY =
      startBottomRef.current + (nextHeight - startHeightRef.current);

    data.onResizePreview(nextY);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const delta = event.clientY - startYRef.current;

    const nextHeight = Math.max(MIN_ROW_HEIGHT, startHeightRef.current + delta);

    setIsResizing(false);

    data.onRowResize(rowIndex, nextHeight);
    data.onResizeEnd();
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
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
      <span>{rowIndex + 1}</span>
    </div>
  );
}, areEqual);

RowHeaderCell.displayName = "RowHeaderCell";

const RowHeaders = forwardRef<Grid, RowHeadersProps>(function RowHeaders(
  { totalRows, width, height, onRowResize, onResizePreview, onResizeEnd },
  ref,
) {
  const getRowHeight = useSizeStore((state) => state.getRowHeight);

  const itemData = useMemo<HeaderItemData>(
    () => ({
      onRowResize,
      onResizePreview,
      onResizeEnd,
    }),
    [onRowResize, onResizePreview, onResizeEnd],
  );

  return (
    <Grid
      ref={ref}
      className={cx("grid")}
      columnCount={1}
      columnWidth={() => width}
      height={height}
      rowCount={totalRows}
      rowHeight={getRowHeight}
      width={width}
      itemData={itemData}
      overscanColumnCount={0}
      overscanRowCount={1}
    >
      {RowHeaderCell}
    </Grid>
  );
});

RowHeaders.displayName = "RowHeaders";

export default RowHeaders;
