import type { Editor } from "@tiptap/react";

import {
  type BooleanStyleKey,
  type SyncStyle,
  type SyncStyleKey,
} from "./styleSyncConfig";

const applyBooleanStyle = (
  editor: Editor,
  key: BooleanStyleKey,
  value: boolean,
) => {
  if (value) {
    editor.commands.setMark(key);
    return;
  }

  editor.commands.unsetMark(key);
};

const applyValueStyle = (
  editor: Editor,
  key: SyncStyleKey,
  value: string | number | null,
) => {
  switch (key) {
    case "fontFamily":
      if (typeof value === "string") {
        editor.commands.setFontFamily(value);
      } else {
        editor.commands.unsetFontFamily();
      }
      break;

    case "fontSize":
      if (typeof value === "number") {
        editor.commands.setFontSize(`${value}px`);
      } else {
        editor.commands.unsetFontSize();
      }
      break;

    case "color":
      if (typeof value === "string") {
        editor.commands.setColor(value);
      } else {
        editor.commands.unsetColor();
      }
      break;
  }
};

export const applyCellStyle = (editor: Editor, style: Partial<SyncStyle>) => {
  if (Object.keys(style).length === 0) {
    return;
  }

  /*
   * Lưu selection hiện tại.
   *
   * Ví dụ user đang bôi:
   *
   * Hello
   * ^^^^^
   *
   * Khi CellStyle thay đổi, ta cần apply cho
   * TOÀN BỘ document nhưng cuối cùng phải
   * trả selection về vị trí cũ.
   */
  const { from, to } = editor.state.selection;

  const { doc } = editor.state;

  const documentEnd = doc.content.size - 1;

  const isFullSelection = from === 1 && to === documentEnd;

  /*
   * CellStyle luôn có nghĩa là style của
   * toàn bộ RichText.
   */
  if (!isFullSelection) {
    editor.commands.selectAll();
  }

  /*
   * Chỉ apply những property thực sự thay đổi.
   */
  if (style.bold !== undefined) {
    applyBooleanStyle(editor, "bold", style.bold);
  }

  if (style.italic !== undefined) {
    applyBooleanStyle(editor, "italic", style.italic);
  }

  if (style.strike !== undefined) {
    applyBooleanStyle(editor, "strike", style.strike);
  }

  if (style.fontFamily !== undefined) {
    applyValueStyle(editor, "fontFamily", style.fontFamily);
  }

  if (style.fontSize !== undefined) {
    applyValueStyle(editor, "fontSize", style.fontSize);
  }

  if (style.color !== undefined) {
    applyValueStyle(editor, "color", style.color);
  }

  /*
   * Khôi phục selection cũ.
   *
   * Không focus editor ở đây.
   */
  editor.commands.setTextSelection({
    from,
    to,
  });
};
