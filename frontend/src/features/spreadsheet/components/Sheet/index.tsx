import { useCallback, useEffect, useRef, useState } from "react";

import type { Editor } from "@tiptap/react";
import { VariableSizeGrid as Grid } from "react-window";

import classNames from "classnames/bind";

import Toolbar from "../Toolbar";

import FormulaBar from "@/features/spreadsheet/components/FormulaBar";

import type { CellStyle } from "@/types/cell-style";

import {
  DEFAULT_CELL_STYLE,
  HEADER_COL_WIDTH,
  HEADER_ROW_HEIGHT,
  SCROLLBAR_SIZE,
  TOTAL_COLS,
  TOTAL_ROWS,
} from "../../model/defaults";

import { useDataStore } from "../../stores/dataStore";
import { useSelectionStore } from "../../stores/selectionStore";
import { useSizeStore } from "../../stores/sizeStore";

import CellsGrid from "./components/CellsGrid";

import { ColumnHeaders, CornerCell, RowHeaders } from "./components/Headers";

import {
  HorizontalScrollbar,
  VerticalScrollbar,
} from "./components/Scrollbars";

import { useSheetScroll } from "./hooks/useSheetScroll";
import { useTouchPan } from "./hooks/useTouchPan";

import styles from "./Sheet.module.scss";

const cx = classNames.bind(styles);

const VIEWPORT_GAP = 4;

interface Size {
  width: number;
  height: number;
}

export default function Sheet() {
  const viewportRef = useRef<HTMLDivElement>(null);

  const bodyGridRef = useRef<Grid>(null);
  const rowHeaderRef = useRef<Grid>(null);
  const columnHeaderRef = useRef<Grid>(null);

  const horizontalScrollbarRef = useRef<HTMLDivElement>(null);
  const verticalScrollbarRef = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  /**
   * Editor hiện tại mà Toolbar điều khiển.
   *
   * Có thể là:
   * - CellEditor
   * - FormulaBar editor
   */
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);

  const [zoom, setZoom] = useState(100);

  /*
   * ==================================================
   * Selection
   * ==================================================
   */

  const activeCell = useSelectionStore((state) => state.activeCell);
  const editingCell = useSelectionStore((state) => state.editingCell);

  const selectCell = useSelectionStore((state) => state.selectCell);
  const startEditing = useSelectionStore((state) => state.startEditing);
  const clearEditingCell = useSelectionStore((state) => state.clearEditingCell);

  /*
   * ==================================================
   * Active cell key
   * ==================================================
   */

  const activeCellKey = activeCell
    ? (`${activeCell.rowIndex}:${activeCell.columnIndex}` as `${number}:${number}`)
    : null;

  /*
   * ==================================================
   * Cell style
   * ==================================================
   */

  const setCellStyle = useDataStore((state) => state.setCellStyle);

  const cellStyle = useDataStore((state) => {
    if (!activeCellKey) {
      return DEFAULT_CELL_STYLE;
    }

    return state.cells[activeCellKey]?.style ?? DEFAULT_CELL_STYLE;
  });

  /*
   * ==================================================
   * Viewport size
   * ==================================================
   */

  useEffect(() => {
    const element = viewportRef.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      const nextWidth = Math.max(0, Math.floor(width));
      const nextHeight = Math.max(0, Math.floor(height));

      setSize((previous) => {
        if (previous.width === nextWidth && previous.height === nextHeight) {
          return previous;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
   * ==================================================
   * Cell select
   * ==================================================
   */

  const handleCellSelect = useCallback(
    (rowIndex: number, columnIndex: number) => {
      selectCell(rowIndex, columnIndex);

      /*
       * Cell mới được select:
       * Toolbar không còn điều khiển editor cũ.
       */
      setActiveEditor(null);
    },
    [selectCell],
  );

  /*
   * ==================================================
   * Cell double click
   * ==================================================
   */

  const handleCellDoubleClick = useCallback(
    (rowIndex: number, columnIndex: number) => {
      startEditing(rowIndex, columnIndex);
    },
    [startEditing],
  );

  /*
   * ==================================================
   * CellEditor ready
   * ==================================================
   */

  const handleEditorReady = useCallback((editor: Editor) => {
    setActiveEditor(editor);
  }, []);

  /*
   * ==================================================
   * Editor focus
   * ==================================================
   */

  const handleEditorFocus = useCallback((editor: Editor) => {
    setActiveEditor(editor);
  }, []);

  /*
   * ==================================================
   * Finish editing
   * ==================================================
   */

  const handleFinishEditing = useCallback(() => {
    clearEditingCell();
    setActiveEditor(null);
  }, [clearEditingCell]);

  /*
   * ==================================================
   * Cell style
   * ==================================================
   */

  const updateCellStyle = useCallback(
    (patch: Partial<CellStyle>) => {
      if (!activeCell) {
        return;
      }

      setCellStyle(activeCell.rowIndex, activeCell.columnIndex, patch);
    },
    [activeCell, setCellStyle],
  );

  /*
   * ==================================================
   * Resize
   * ==================================================
   */

  const setColumnWidth = useSizeStore((state) => state.setColumnWidth);

  const setRowHeight = useSizeStore((state) => state.setRowHeight);

  const handleColumnResize = useCallback(
    (columnIndex: number, width: number) => {
      setColumnWidth(columnIndex, width);

      bodyGridRef.current?.resetAfterColumnIndex(columnIndex, true);

      columnHeaderRef.current?.resetAfterColumnIndex(columnIndex, true);
    },
    [setColumnWidth],
  );

  const handleRowResize = useCallback(
    (rowIndex: number, height: number) => {
      setRowHeight(rowIndex, height);

      bodyGridRef.current?.resetAfterRowIndex(rowIndex, true);

      rowHeaderRef.current?.resetAfterRowIndex(rowIndex, true);
    },
    [setRowHeight],
  );

  /*
   * ==================================================
   * Total size
   * ==================================================
   */

  const getTotalWidth = useSizeStore((state) => state.getTotalWidth);

  const getTotalHeight = useSizeStore((state) => state.getTotalHeight);

  const totalWidth = getTotalWidth(TOTAL_COLS);
  const totalHeight = getTotalHeight(TOTAL_ROWS);

  const sheetWidth = Math.max(0, size.width - SCROLLBAR_SIZE - VIEWPORT_GAP);

  const sheetHeight = Math.max(0, size.height - SCROLLBAR_SIZE - VIEWPORT_GAP);

  const bodyWidth = Math.max(0, sheetWidth - HEADER_COL_WIDTH);

  const bodyHeight = Math.max(0, sheetHeight - HEADER_ROW_HEIGHT);

  /*
   * ==================================================
   * Scroll
   * ==================================================
   */

  const {
    handleHorizontalScroll,
    handleVerticalScroll,
    handleWheel,
    scrollBy,
  } = useSheetScroll({
    bodyGridRef,
    rowHeaderRef,
    columnHeaderRef,
    horizontalScrollbarRef,
    verticalScrollbarRef,
  });

  useTouchPan({
    targetRef: viewportRef,
    scrollBy,
  });

  return (
    <div className={cx("wrapper")}>
      <div className={cx("toolbar")}>
        <Toolbar
          editing={editingCell !== null}
          cellKey={activeCellKey}
          editor={activeEditor}
          cellStyle={cellStyle}
          updateCellStyle={updateCellStyle}
          zoom={zoom}
          setZoom={setZoom}
        />
      </div>

      <FormulaBar onEditorFocus={handleEditorFocus} />

      <div ref={viewportRef} className={cx("viewport")}>
        {size.width > 0 && size.height > 0 && (
          <>
            <div className={cx("sheet")} onWheel={handleWheel}>
              <div className={cx("top-bar")}>
                <CornerCell
                  width={HEADER_COL_WIDTH}
                  height={HEADER_ROW_HEIGHT}
                />

                <ColumnHeaders
                  ref={columnHeaderRef}
                  totalCols={TOTAL_COLS}
                  width={bodyWidth}
                  height={HEADER_ROW_HEIGHT}
                  onColumnResize={handleColumnResize}
                />
              </div>

              <div className={cx("main-body")}>
                <RowHeaders
                  ref={rowHeaderRef}
                  totalRows={TOTAL_ROWS}
                  width={HEADER_COL_WIDTH}
                  height={bodyHeight}
                  onRowResize={handleRowResize}
                />

                <CellsGrid
                  ref={bodyGridRef}
                  totalRows={TOTAL_ROWS}
                  totalCols={TOTAL_COLS}
                  width={bodyWidth}
                  height={bodyHeight}
                  onCellSelect={handleCellSelect}
                  onCellDoubleClick={handleCellDoubleClick}
                  onEditorReady={handleEditorReady}
                  onEditorFocus={handleEditorFocus}
                  onFinishEditing={handleFinishEditing}
                />
              </div>
            </div>

            <VerticalScrollbar
              ref={verticalScrollbarRef}
              className={cx("y-driver")}
              totalHeight={totalHeight + HEADER_ROW_HEIGHT}
              onScroll={handleVerticalScroll}
            />

            <HorizontalScrollbar
              ref={horizontalScrollbarRef}
              className={cx("x-driver")}
              totalWidth={totalWidth + HEADER_COL_WIDTH}
              onScroll={handleHorizontalScroll}
            />
          </>
        )}
      </div>
    </div>
  );
}
