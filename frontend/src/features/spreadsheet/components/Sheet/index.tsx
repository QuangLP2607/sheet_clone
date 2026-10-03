import { useCallback, useEffect, useRef, useState } from "react";

import { VariableSizeGrid as Grid } from "react-window";

import classNames from "classnames/bind";

import Toolbar from "../Toolbar";
import FormulaBar from "../FormulaBar";

import { useSheetKeyboard } from "./keyboard/useSheetKeyboard";

import type { CellStyle } from "@/features/spreadsheet/types";

import {
  DEFAULT_CELL_STYLE,
  HEADER_COL_WIDTH,
  HEADER_ROW_HEIGHT,
  TOTAL_COLS,
  TOTAL_ROWS,
} from "@/features/spreadsheet/types";

import { useDataStore } from "@/features/spreadsheet/stores/dataStore";
import { useSelectionStore } from "@/features/spreadsheet/stores/selectionStore";
import { useSizeStore } from "@/features/spreadsheet/stores/sizeStore";

import { useActiveTextStyle } from "./hooks/useActiveTextStyle";

import CellsGrid from "./components/CellsGrid";

import { ColumnHeaders, CornerCell, RowHeaders } from "./components/Headers";

import {
  HorizontalScrollbar,
  VerticalScrollbar,
} from "./components/Scrollbars";

import { EditingEditorProvider } from "../../providers/EditingEditor";

import { useSheetScroll } from "./hooks/useSheetScroll";
import { useTouchPan } from "./hooks/useTouchPan";

import styles from "./Sheet.module.scss";

const cx = classNames.bind(styles);

interface Size {
  width: number;
  height: number;
}

export default function Sheet() {
  return (
    <EditingEditorProvider>
      <SheetContent />
    </EditingEditorProvider>
  );
}

function SheetContent() {
  /* ==================================================
   * Refs
   * ================================================== */

  const viewportRef = useRef<HTMLDivElement>(null);

  const sheetRef = useRef<HTMLDivElement>(null);

  const bodyGridRef = useRef<Grid>(null);

  const rowHeaderRef = useRef<Grid>(null);

  const columnHeaderRef = useRef<Grid>(null);

  const horizontalScrollbarRef = useRef<HTMLDivElement>(null);

  const verticalScrollbarRef = useRef<HTMLDivElement>(null);

  /* ==================================================
   * Keyboard
   * ================================================== */

  useSheetKeyboard({
    totalRows: TOTAL_ROWS,
    totalCols: TOTAL_COLS,
  });

  /* ==================================================
   * Selection
   * ================================================== */

  const activeCellKey = useSelectionStore((state) => state.activeCellKey);

  /* ==================================================
   * Active cell
   * ================================================== */

  const activeCell = useDataStore((state) =>
    activeCellKey ? state.cells[activeCellKey] : undefined,
  );

  const cellStyle = activeCell?.style ?? DEFAULT_CELL_STYLE;

  /* ==================================================
   * Toolbar - TextStyle
   * ================================================== */

  const { textStyle, updateTextStyle } = useActiveTextStyle();

  /* ==================================================
   * Toolbar - CellStyle
   * ================================================== */

  const setCellStyle = useDataStore((state) => state.setCellStyle);

  const updateCellStyle = useCallback(
    (patch: Partial<CellStyle>) => {
      if (!activeCellKey) {
        return;
      }

      setCellStyle(activeCellKey, patch);
    },
    [activeCellKey, setCellStyle],
  );

  /* ==================================================
   * Sheet size
   * ================================================== */

  const [sheetSize, setSheetSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const element = sheetRef.current;

    if (!element) {
      return;
    }

    const updateSheetSize = () => {
      const rect = element.getBoundingClientRect();

      const width = Math.max(0, Math.floor(rect.width));
      const height = Math.max(0, Math.floor(rect.height));

      setSheetSize((previous) => {
        if (previous.width === width && previous.height === height) {
          return previous;
        }

        return {
          width,
          height,
        };
      });
    };

    updateSheetSize();

    const observer = new ResizeObserver(updateSheetSize);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* ==================================================
   * Initialize sizes
   * ================================================== */

  const initializeSizes = useSizeStore((state) => state.initializeSizes);

  useEffect(() => {
    initializeSizes({
      totalRows: TOTAL_ROWS,
      totalCols: TOTAL_COLS,
    });
  }, [initializeSizes]);

  /* ==================================================
   * Resize
   * ================================================== */

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

  /* ==================================================
   * Resize preview
   * ================================================== */

  const [resizePreviewX, setResizePreviewX] = useState<number | null>(null);

  const [resizePreviewY, setResizePreviewY] = useState<number | null>(null);

  const resizeXFrameRef = useRef<number | null>(null);

  const resizeYFrameRef = useRef<number | null>(null);

  const pendingResizeXRef = useRef<number | null>(null);

  const pendingResizeYRef = useRef<number | null>(null);

  /* ==================================================
   * Column resize preview
   * ================================================== */

  const handleColumnResizePreview = useCallback((clientX: number) => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const viewportRect = viewport.getBoundingClientRect();

    pendingResizeXRef.current = clientX - viewportRect.left;

    if (resizeXFrameRef.current !== null) {
      return;
    }

    resizeXFrameRef.current = requestAnimationFrame(() => {
      resizeXFrameRef.current = null;

      const x = pendingResizeXRef.current;

      if (x === null) {
        return;
      }

      setResizePreviewX(x);
    });
  }, []);

  /* ==================================================
   * Row resize preview
   * ================================================== */

  const handleRowResizePreview = useCallback((clientY: number) => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const viewportRect = viewport.getBoundingClientRect();

    pendingResizeYRef.current = clientY - viewportRect.top;

    if (resizeYFrameRef.current !== null) {
      return;
    }

    resizeYFrameRef.current = requestAnimationFrame(() => {
      resizeYFrameRef.current = null;

      const y = pendingResizeYRef.current;

      if (y === null) {
        return;
      }

      setResizePreviewY(y);
    });
  }, []);

  /* ==================================================
   * Column resize end
   * ================================================== */

  const handleColumnResizeEnd = useCallback(() => {
    if (resizeXFrameRef.current !== null) {
      cancelAnimationFrame(resizeXFrameRef.current);

      resizeXFrameRef.current = null;
    }

    pendingResizeXRef.current = null;

    setResizePreviewX(null);
  }, []);

  /* ==================================================
   * Row resize end
   * ================================================== */

  const handleRowResizeEnd = useCallback(() => {
    if (resizeYFrameRef.current !== null) {
      cancelAnimationFrame(resizeYFrameRef.current);

      resizeYFrameRef.current = null;
    }

    pendingResizeYRef.current = null;

    setResizePreviewY(null);
  }, []);

  /* ==================================================
   * Cleanup resize animation frames
   * ================================================== */

  useEffect(() => {
    return () => {
      if (resizeXFrameRef.current !== null) {
        cancelAnimationFrame(resizeXFrameRef.current);
      }

      if (resizeYFrameRef.current !== null) {
        cancelAnimationFrame(resizeYFrameRef.current);
      }
    };
  }, []);

  /* ==================================================
   * Total sheet size
   * ================================================== */

  const totalWidth = useSizeStore((state) => state.totalWidth);

  const totalHeight = useSizeStore((state) => state.totalHeight);

  /* ==================================================
   * Body size
   * ================================================== */

  const bodyWidth = Math.max(0, sheetSize.width - HEADER_COL_WIDTH);

  const bodyHeight = Math.max(0, sheetSize.height - HEADER_ROW_HEIGHT);

  /* ==================================================
   * Scroll
   * ================================================== */

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

  /* ==================================================
   * Touch
   * ================================================== */

  useTouchPan({
    targetRef: viewportRef,
    scrollBy,
  });

  /* ==================================================
   * Render
   * ================================================== */

  return (
    <div className={cx("wrapper")}>
      <div className={cx("toolbar")}>
        <Toolbar
          textStyle={textStyle}
          cellStyle={cellStyle}
          updateTextStyle={updateTextStyle}
          updateCellStyle={updateCellStyle}
          zoom={100}
          setZoom={() => {}}
        />
      </div>

      <FormulaBar />

      <div ref={viewportRef} className={cx("viewport")}>
        {/* Column resize preview */}
        {resizePreviewX !== null && (
          <div
            className={cx("resize-preview-line", "resize-preview-line--x")}
            style={{
              left: resizePreviewX,
              height: sheetSize.height,
            }}
          />
        )}

        {/* Row resize preview */}
        {resizePreviewY !== null && (
          <div
            className={cx("resize-preview-line", "resize-preview-line--y")}
            style={{
              top: resizePreviewY,
              width: sheetSize.width,
            }}
          />
        )}

        <div ref={sheetRef} className={cx("sheet")} onWheel={handleWheel}>
          <div className={cx("top-bar")}>
            <CornerCell width={HEADER_COL_WIDTH} height={HEADER_ROW_HEIGHT} />

            <ColumnHeaders
              ref={columnHeaderRef}
              totalCols={TOTAL_COLS}
              width={bodyWidth}
              height={HEADER_ROW_HEIGHT}
              onColumnResize={handleColumnResize}
              onResizePreview={handleColumnResizePreview}
              onResizeEnd={handleColumnResizeEnd}
            />
          </div>

          <div className={cx("main-body")}>
            <RowHeaders
              ref={rowHeaderRef}
              totalRows={TOTAL_ROWS}
              width={HEADER_COL_WIDTH}
              height={bodyHeight}
              onRowResize={handleRowResize}
              onResizePreview={handleRowResizePreview}
              onResizeEnd={handleRowResizeEnd}
            />

            <CellsGrid
              ref={bodyGridRef}
              totalRows={TOTAL_ROWS}
              totalCols={TOTAL_COLS}
              width={bodyWidth}
              height={bodyHeight}
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

        <div className={cx("corner")} />
      </div>
    </div>
  );
}
