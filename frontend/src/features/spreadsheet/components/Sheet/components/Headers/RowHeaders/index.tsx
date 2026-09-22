import { forwardRef, memo, useRef, useState } from "react";

import type { PointerEvent } from "react";

import {
  VariableSizeGrid as Grid,
  type GridChildComponentProps,
} from "react-window";

import classNames from "classnames/bind";

import { useSizeStore } from "@/features/spreadsheet/stores/sizeStore";

import { HEADER_COL_WIDTH } from "@/features/spreadsheet/model/defaults";

import styles from "./RowHeaders.module.scss";

const cx = classNames.bind(styles);

const RESIZE_EDGE_SIZE = 6;

interface RowHeadersProps {
  totalRows: number;
  width: number;
  height: number;

  onRowResize: (rowIndex: number, height: number) => void;
}

interface HeaderItemData {
  onRowResize: (rowIndex: number, height: number) => void;
}

const RowHeaderCell = memo(function RowHeaderCell({
  rowIndex,
  style,
  data,
}: GridChildComponentProps<HeaderItemData>) {
  const rowHeight = useSizeStore((state) => state.rowHeights[rowIndex] ?? 30);

  const startYRef = useRef(0);

  const startHeightRef = useRef(rowHeight);

  const [isResizing, setIsResizing] = useState(false);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const isResizeArea = event.clientY >= rect.bottom - RESIZE_EDGE_SIZE;

    if (!isResizeArea) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    startYRef.current = event.clientY;

    startHeightRef.current = rowHeight;

    event.currentTarget.setPointerCapture(event.pointerId);

    setIsResizing(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const delta = event.clientY - startYRef.current;

    data.onRowResize(rowIndex, startHeightRef.current + delta);
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
      <span>{rowIndex + 1}</span>
    </div>
  );
});

const RowHeaders = forwardRef<Grid, RowHeadersProps>(function RowHeaders(
  { totalRows, width, height, onRowResize },
  ref,
) {
  const getRowHeight = useSizeStore((state) => state.getRowHeight);

  return (
    <Grid
      ref={ref}
      className={cx("grid")}
      columnCount={1}
      columnWidth={() => HEADER_COL_WIDTH}
      height={height}
      rowCount={totalRows}
      rowHeight={getRowHeight}
      width={width}
      itemData={{
        onRowResize,
      }}
    >
      {RowHeaderCell}
    </Grid>
  );
});

export default RowHeaders;
