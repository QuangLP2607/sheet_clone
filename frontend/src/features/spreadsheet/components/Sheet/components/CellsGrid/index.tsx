import { forwardRef, memo, useMemo } from "react";

import type { Editor } from "@tiptap/react";

import {
  VariableSizeGrid as Grid,
  type GridChildComponentProps,
} from "react-window";

import classNames from "classnames/bind";

import CellContainer from "../CellContainer";

import styles from "./CellsGrid.module.scss";

const cx = classNames.bind(styles);

interface CellsGridProps {
  totalRows: number;
  totalCols: number;

  width: number;
  height: number;

  onCellSelect: (rowIndex: number, columnIndex: number) => void;

  onCellDoubleClick: (rowIndex: number, columnIndex: number) => void;

  onEditorReady: (editor: Editor) => void;
  onEditorFocus: (editor: Editor) => void;

  onFinishEditing: () => void;
}

interface CellItemData {
  onCellSelect: (rowIndex: number, columnIndex: number) => void;

  onCellDoubleClick: (rowIndex: number, columnIndex: number) => void;

  onEditorReady: (editor: Editor) => void;
  onEditorFocus: (editor: Editor) => void;

  onFinishEditing: () => void;
}

const Cell = memo(
  ({
    rowIndex,
    columnIndex,
    style,
    data,
  }: GridChildComponentProps<CellItemData>) => {
    return (
      <div style={style}>
        <CellContainer
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          onCellSelect={data.onCellSelect}
          onCellDoubleClick={data.onCellDoubleClick}
          onEditorReady={data.onEditorReady}
          onEditorFocus={data.onEditorFocus}
          onFinishEditing={data.onFinishEditing}
        />
      </div>
    );
  },
);

Cell.displayName = "Cell";

const CellsGrid = forwardRef<Grid, CellsGridProps>(function CellsGrid(
  {
    totalRows,
    totalCols,
    width,
    height,
    onCellSelect,
    onCellDoubleClick,
    onEditorReady,
    onEditorFocus,
    onFinishEditing,
  },
  ref,
) {
  const itemData = useMemo<CellItemData>(
    () => ({
      onCellSelect,
      onCellDoubleClick,
      onEditorReady,
      onEditorFocus,
      onFinishEditing,
    }),
    [
      onCellSelect,
      onCellDoubleClick,
      onEditorReady,
      onEditorFocus,
      onFinishEditing,
    ],
  );

  return (
    <Grid
      className={cx("grid")}
      ref={ref}
      columnCount={totalCols}
      rowCount={totalRows}
      width={width}
      height={height}
      itemData={itemData}
      columnWidth={() => 100}
      rowHeight={() => 24}
    >
      {Cell}
    </Grid>
  );
});

export default CellsGrid;
