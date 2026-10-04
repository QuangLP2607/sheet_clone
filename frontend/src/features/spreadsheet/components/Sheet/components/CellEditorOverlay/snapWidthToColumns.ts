interface SnapWidthToColumnsParams {
  startColumn: number;
  requiredWidth: number;
  maxWidth: number;
  getColumnWidth: (columnIndex: number) => number;
}

/**
 * Tính chiều rộng editor dựa trên tổng chiều rộng
 * của các cột bắt đầu từ cột hiện tại.
 *
 * Ví dụ:
 *
 *   A = 80px
 *   B = 100px
 *   C = 120px
 *
 *   requiredWidth = 150px
 *
 *   A + B = 180px
 *
 *   => trả về 180px
 */
export function snapWidthToColumns({
  startColumn,
  requiredWidth,
  maxWidth,
  getColumnWidth,
}: SnapWidthToColumnsParams): number {
  if (startColumn < 0 || maxWidth <= 0) {
    return 0;
  }

  /**
   * Nội dung đã vượt quá giới hạn viewport.
   */
  if (requiredWidth >= maxWidth) {
    return maxWidth;
  }

  let width = 0;
  let columnIndex = startColumn;

  while (true) {
    const columnWidth = getColumnWidth(columnIndex);

    /**
     * Không thể tiếp tục nếu cột không tồn tại
     * hoặc có chiều rộng không hợp lệ.
     */
    if (columnWidth <= 0) {
      return width;
    }

    const nextWidth = width + columnWidth;

    /**
     * Không được mở rộng vượt quá viewport.
     */
    if (nextWidth > maxWidth) {
      return maxWidth;
    }

    width = nextWidth;

    /**
     * Đã đủ chiều rộng cho nội dung.
     */
    if (width >= requiredWidth) {
      return width;
    }

    columnIndex += 1;
  }
}
