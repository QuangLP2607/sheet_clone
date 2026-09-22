import { useEffect } from "react";

import type { JSONContent } from "@tiptap/core";
import type { Editor } from "@tiptap/react";

import RichTextEditor from "@/features/spreadsheet/components/RichTextEditor";
import { useRichTextEditor } from "@/features/spreadsheet/components/RichTextEditor/hooks";

interface CellEditorProps {
  content: JSONContent;
  shouldFocus: boolean;

  onCommit: (content: JSONContent) => void;

  onEditorReady: (editor: Editor) => void;

  onEditorFocus: (editor: Editor) => void;

  onFinish: () => void;
}

export default function CellEditor({
  content,
  shouldFocus,
  onCommit,
  onEditorReady,
  onEditorFocus,
  onFinish,
}: CellEditorProps) {
  const editor = useRichTextEditor(content);

  /*
   * ==================================================
   * Editor ready
   * ==================================================
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    onEditorReady(editor);
  }, [editor, onEditorReady]);

  /*
   * ==================================================
   * CellEditor focus
   * ==================================================
   *
   * Chỉ CellEditor mới tự focus khi
   * shouldFocus = true.
   */
  useEffect(() => {
    if (!editor || !shouldFocus) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      editor.commands.focus("end");

      onEditorFocus(editor);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [editor, shouldFocus, onEditorFocus]);

  /*
   * ==================================================
   * CellEditor → dataStore
   * ==================================================
   *
   * Gõ / format trong CellEditor
   * → content trong dataStore thay đổi.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    const handleUpdate = () => {
      onCommit(editor.getJSON());
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, onCommit]);

  /*
   * ==================================================
   * dataStore → CellEditor
   * ==================================================
   *
   * FormulaBar thay đổi content
   * → CellEditor nhận content mới.
   *
   * emitUpdate = false
   * để không tạo vòng lặp.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentContent = editor.getJSON();

    if (JSON.stringify(currentContent) === JSON.stringify(content)) {
      return;
    }

    editor.commands.setContent(content, {
      emitUpdate: false,
    });
  }, [editor, content]);

  /*
   * ==================================================
   * Keyboard
   * ==================================================
   */

  useEffect(() => {
    if (!editor) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();

        onFinish();

        return;
      }

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        onFinish();
      }
    };

    editor.view.dom.addEventListener("keydown", handleKeyDown);

    return () => {
      editor.view.dom.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, onFinish]);

  /*
   * ==================================================
   * Render
   * ==================================================
   */

  if (!editor) {
    return null;
  }

  return <RichTextEditor editor={editor} onFocus={onEditorFocus} />;
}
