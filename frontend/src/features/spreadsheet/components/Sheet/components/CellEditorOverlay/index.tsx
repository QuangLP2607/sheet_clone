import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
  type WheelEvent,
} from "react";

import classNames from "classnames/bind";
import { useShallow } from "zustand/react/shallow";

import Cell from "@/features/spreadsheet/components/Cell";

import {
  DEFAULT_CELL_CONTENT,
  DEFAULT_CELL_STYLE,
  DEFAULT_TEXT_STYLE,
} from "@/features/spreadsheet/types";

import type { CellStyle } from "@/features/spreadsheet/types";

import { useDataStore } from "@/features/spreadsheet/stores/dataStore";
import { useSelectionStore } from "@/features/spreadsheet/stores/selectionStore";
import { useSizeStore } from "@/features/spreadsheet/stores/sizeStore";

import {
  getCellAddress,
  parseCellKey,
} from "@/features/spreadsheet/utils/cellAddress";

import CellEditor from "../CellContainer/CellEditor";

import { snapWidthToColumns } from "./snapWidthToColumns";

import styles from "./CellEditorOverlay.module.scss";

const cx = classNames.bind(styles);

/**
 * Khoảng cách chừa lại giữa editor và mép phải / mép dưới viewport.
 */
const EDGE_GUTTER = 16;

/**
 * Khoảng dư thêm cho caret.
 */
const CARET_SLACK = 2;

/**
 * Độ rộng border của editor.
 *
 * Phải đồng bộ với border trong SCSS.
 */
const EDITOR_BORDER = 2;

/**
 * Độ rộng tối thiểu của vùng đo.
 */
const MIN_MEASURE_WIDTH = 5;

interface CellEditorOverlayProps {
  viewportRef: RefObject<HTMLDivElement | null>;

  onWheel: (event: WheelEvent<HTMLDivElement>) => void;

  /**
   * Đăng ký listener nhận thông báo khi viewport di chuyển.
   *
   * Listener được sử dụng theo kiểu one-shot:
   *
   * scroll lần đầu
   *     ↓
   * hiện address
   *     ↓
   * unregister listener
   */
  registerViewMoveListener: (listener: (() => void) | null) => void;
}

type EditorCellStyle = Pick<
  CellStyle,
  "fillColor" | "horizontalAlign" | "verticalAlign"
>;

interface ViewportBounds {
  right: number;
  bottom: number;
}

interface SnappedWidth {
  cellKey: string;
  width: number;
}

export default function CellEditorOverlay({
  viewportRef,
  onWheel,
  registerViewMoveListener,
}: CellEditorOverlayProps) {
  const { editingCellKey, editingTarget, editingRect } = useSelectionStore(
    useShallow((state) => ({
      editingCellKey: state.editingCellKey,
      editingTarget: state.editingTarget,
      editingRect: state.editingRect,
    })),
  );

  const cell = useDataStore((state) =>
    editingCellKey ? state.cells[editingCellKey] : undefined,
  );

  /**
   * Ref tới phần tử dùng để đo chiều rộng nội dung.
   */
  const measureRef = useRef<HTMLDivElement>(null);

  /**
   * Kích thước mép phải và mép dưới của viewport.
   */
  const [viewportBounds, setViewportBounds] = useState<ViewportBounds | null>(
    null,
  );

  /**
   * Chiều rộng editor sau khi snap theo các cột.
   */
  const [snappedWidth, setSnappedWidth] = useState<SnappedWidth | null>(null);

  /**
   * Địa chỉ mặc định không hiển thị.
   *
   * Chỉ scroll lần đầu mới chuyển:
   *
   * false -> true
   *
   * Sau đó listener được unregister.
   *
   * Khi đổi cell, component được remount nên
   * state tự động trở lại false.
   */
  const [showAddress, setShowAddress] = useState(false);

  /**
   * Editor chỉ hoạt động khi:
   *
   * - đang có cell được edit
   * - target là cell
   * - đã có editingRect
   */
  const isActive = Boolean(
    editingCellKey && editingTarget === "cell" && editingRect,
  );

  const rectLeft = editingRect?.left ?? 0;

  const rectTop = editingRect?.top ?? 0;

  const rectWidth = editingRect?.width ?? 0;

  const rectHeight = editingRect?.height ?? 0;

  /**
   * Xử lý lần viewport di chuyển đầu tiên.
   *
   * Sau khi hiện address:
   *
   * - showAddress = true
   * - listener bị xoá
   *
   * Vì vậy các lần scroll tiếp theo
   * không còn gọi vào editor.
   */
  const handleViewMove = useCallback(() => {
    setShowAddress(true);

    registerViewMoveListener(null);
  }, [registerViewMoveListener]);

  /**
   * Đăng ký one-shot listener.
   *
   * Khi component unmount:
   * listener cũng được xoá.
   */
  useEffect(() => {
    registerViewMoveListener(handleViewMove);

    return () => {
      registerViewMoveListener(null);
    };
  }, [registerViewMoveListener, handleViewMove]);

  /**
   * Theo dõi kích thước viewport.
   *
   * Editor không được mở rộng vượt quá viewport
   * đang nhìn thấy.
   */
  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport || !isActive) {
      return;
    }

    const updateViewportBounds = () => {
      const rect = viewport.getBoundingClientRect();

      setViewportBounds((previous) => {
        if (previous?.right === rect.right && previous.bottom === rect.bottom) {
          return previous;
        }

        return {
          right: rect.right,
          bottom: rect.bottom,
        };
      });
    };

    updateViewportBounds();

    const observer = new ResizeObserver(updateViewportBounds);

    observer.observe(viewport);

    window.addEventListener("resize", updateViewportBounds);

    return () => {
      observer.disconnect();

      window.removeEventListener("resize", updateViewportBounds);
    };
  }, [viewportRef, isActive]);

  /**
   * Chiều rộng tối đa mà editor được phép mở rộng.
   */
  const maxWidth = viewportBounds
    ? Math.max(rectWidth, viewportBounds.right - rectLeft - EDGE_GUTTER)
    : rectWidth;

  /**
   * Chiều cao tối đa mà editor được phép sử dụng.
   */
  const maxHeight = viewportBounds
    ? Math.max(rectHeight, viewportBounds.bottom - rectTop - EDGE_GUTTER)
    : rectHeight;

  /**
   * Đo chiều rộng nội dung và snap editor
   * theo chiều rộng thực tế của các cột.
   */
  useEffect(() => {
    const measure = measureRef.current;

    if (!measure || !isActive || !editingCellKey) {
      return;
    }

    const { columnIndex } = parseCellKey(editingCellKey);

    if (!Number.isInteger(columnIndex) || columnIndex < 0) {
      return;
    }

    const updateWidth = () => {
      /**
       * Chiều rộng tự nhiên của nội dung.
       */
      const naturalWidth = Math.ceil(measure.scrollWidth);

      /**
       * Cộng thêm khoảng cho caret và border.
       */
      const requiredWidth = naturalWidth + CARET_SLACK + EDITOR_BORDER * 2;

      /**
       * Snap theo chiều rộng thực tế của các cột.
       */
      const snappedColumnWidth = snapWidthToColumns({
        startColumn: columnIndex,
        requiredWidth,
        maxWidth,
        getColumnWidth: useSizeStore.getState().getColumnWidth,
      });

      /**
       * Không nhỏ hơn cell ban đầu.
       */
      const nextWidth = Math.max(rectWidth, snappedColumnWidth);

      setSnappedWidth((previous) => {
        if (
          previous?.cellKey === editingCellKey &&
          previous.width === nextWidth
        ) {
          return previous;
        }

        return {
          cellKey: editingCellKey,
          width: nextWidth,
        };
      });
    };

    /**
     * Đo ngay khi editor xuất hiện.
     */
    updateWidth();

    /**
     * Theo dõi thay đổi kích thước nội dung.
     */
    const observer = new ResizeObserver(updateWidth);

    observer.observe(measure);

    return () => {
      observer.disconnect();
    };
  }, [isActive, editingCellKey, rectWidth, maxWidth]);

  if (!editingCellKey || !editingRect || !isActive) {
    return null;
  }

  const content = cell?.content ?? DEFAULT_CELL_CONTENT;

  const cellStyle = cell?.style ?? DEFAULT_CELL_STYLE;

  const textStyle = cell?.textStyle ?? DEFAULT_TEXT_STYLE;

  const editorCellStyle: EditorCellStyle = {
    fillColor: cellStyle.fillColor,
    horizontalAlign: cellStyle.horizontalAlign,
    verticalAlign: cellStyle.verticalAlign,
  };

  /**
   * Chiều rộng hiển thị thực tế.
   */
  const width =
    snappedWidth?.cellKey === editingCellKey ? snappedWidth.width : rectWidth;

  /**
   * Giới hạn vùng measure.
   */
  const measureMaxWidth = Math.max(
    MIN_MEASURE_WIDTH,
    maxWidth - EDITOR_BORDER * 2,
  );

  const { rowIndex, columnIndex } = parseCellKey(editingCellKey);

  /**
   * Địa chỉ kiểu A1, B2, AA10...
   *
   * Dùng helper có sẵn trong cellAddress.
   */
  const cellAddress = getCellAddress(rowIndex, columnIndex);

  return (
    <div
      className={cx("editor-wrapper")}
      style={{
        left: rectLeft,
        top: rectTop,
        width,
      }}
    >
      {showAddress && <div className={cx("address")}>{cellAddress}</div>}

      <div
        className={cx("editor")}
        style={{
          minHeight: rectHeight,
          maxHeight,
          background: cellStyle.fillColor,
        }}
        onWheel={onWheel}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <div
          ref={measureRef}
          className={cx("measure")}
          style={{
            maxWidth: measureMaxWidth,
          }}
        >
          <Cell style={editorCellStyle} editing className={styles.cell}>
            <CellEditor
              cellKey={editingCellKey}
              content={content}
              textStyle={textStyle}
            />
          </Cell>
        </div>
      </div>
    </div>
  );
}
