import { forwardRef, memo, useRef, useState } from "react";

import type { PointerEvent } from "react";

import {
  VariableSizeGrid as Grid,
  type GridChildComponentProps,
} from "react-window";

import classNames from "classnames/bind";

import { useSizeStore } from "@/features/spreadsheet/stores/sizeStore";
import { getColumnLabel } from "@/features/spreadsheet/utils/cellAddress";
import { HEADER_ROW_HEIGHT } from "@/features/spreadsheet/model/defaults";

import styles from "./ColumnHeaders.module.scss";

const cx = classNames.bind(styles);

const RESIZE_EDGE_SIZE = 6;

interface ColumnHeadersProps {
  totalCols: number;
  width: number;
  height: number;
  onColumnResize: (columnIndex: number, width: number) => void;
}

interface HeaderItemData {
  onColumnResize: (columnIndex: number, width: number) => void;
}

const ColumnHeaderCell = memo(function ColumnHeaderCell({
  columnIndex,
  style,
  data,
}: GridChildComponentProps<HeaderItemData>) {
  const columnWidth = useSizeStore(
    (state) => state.columnWidths[columnIndex] ?? 100,
  );

  const startXRef = useRef(0);
  const startWidthRef = useRef(columnWidth);

  const [isResizing, setIsResizing] = useState(false);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const isResizeArea = event.clientX >= rect.right - RESIZE_EDGE_SIZE;

    if (!isResizeArea) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    startXRef.current = event.clientX;
    startWidthRef.current = columnWidth;

    event.currentTarget.setPointerCapture(event.pointerId);

    setIsResizing(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const delta = event.clientX - startXRef.current;

    data.onColumnResize(columnIndex, startWidthRef.current + delta);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsResizing(false);
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsResizing(false);
  };

  return (
    <div
      style={style}
      className={cx("cell", {
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
});

const ColumnHeaders = forwardRef<Grid, ColumnHeadersProps>(
  function ColumnHeaders({ totalCols, width, height, onColumnResize }, ref) {
    const getColumnWidth = useSizeStore((state) => state.getColumnWidth);

    return (
      <Grid
        ref={ref}
        className={cx("grid")}
        columnCount={totalCols}
        columnWidth={getColumnWidth}
        height={height}
        rowCount={1}
        rowHeight={() => HEADER_ROW_HEIGHT}
        width={width}
        itemData={{
          onColumnResize,
        }}
      >
        {ColumnHeaderCell}
      </Grid>
    );
  },
);

export default ColumnHeaders;
