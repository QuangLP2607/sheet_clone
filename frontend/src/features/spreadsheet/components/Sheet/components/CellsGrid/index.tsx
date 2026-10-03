import { forwardRef, memo } from "react";

import {
  VariableSizeGrid as Grid,
  areEqual,
  type GridChildComponentProps,
} from "react-window";

import classNames from "classnames/bind";

import { useSizeStore } from "@/features/spreadsheet/stores/sizeStore";

import CellContainer from "../CellContainer";

import styles from "./CellsGrid.module.scss";

const cx = classNames.bind(styles);

interface CellsGridProps {
  totalRows: number;
  totalCols: number;
  width: number;
  height: number;
}

const GridCell = memo(function GridCell({
  rowIndex,
  columnIndex,
  style,
}: GridChildComponentProps) {
  return (
    <div style={style}>
      <CellContainer rowIndex={rowIndex} columnIndex={columnIndex} />
    </div>
  );
}, areEqual);

GridCell.displayName = "GridCell";

const CellsGrid = forwardRef<Grid, CellsGridProps>(function CellsGrid(
  { totalRows, totalCols, width, height },
  ref,
) {
  const getColumnWidth = useSizeStore((state) => state.getColumnWidth);

  const getRowHeight = useSizeStore((state) => state.getRowHeight);

  return (
    <Grid
      ref={ref}
      className={cx("grid")}
      columnCount={totalCols}
      columnWidth={getColumnWidth}
      height={height}
      rowCount={totalRows}
      rowHeight={getRowHeight}
      width={width}
      overscanColumnCount={1}
      overscanRowCount={1}
    >
      {GridCell}
    </Grid>
  );
});

export default CellsGrid;
