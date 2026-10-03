import { useEffect, useRef } from "react";

import type { JSONContent } from "@tiptap/core";

import RichTextEditor from "@/features/spreadsheet/components/RichTextEditor";

import { useRichTextEditor } from "@/features/spreadsheet/components/RichTextEditor/hooks";

import { useEditingEditor } from "@/features/spreadsheet/providers/EditingEditor";

import { useDataStore } from "@/features/spreadsheet/stores/dataStore";

import type { CellKey, TextStyle } from "@/features/spreadsheet/types";

interface FormulaBarEditorProps {
  cellKey: CellKey;

  content: JSONContent;

  textStyle: TextStyle;

  editable: boolean;
}

export default function FormulaBarEditor({
  cellKey,
  content,
  textStyle,
  editable,
}: FormulaBarEditorProps) {
  const { setEditor, setEditorReady } = useEditingEditor();

  const setCellContent = useDataStore((state) => state.setCellContent);

  const previousCellKeyRef = useRef<CellKey | null>(null);

  const editor = useRichTextEditor({
    content,

    initialTextStyle: textStyle,

    /*
     * Editor luôn được tạo read-only.
     *
     * Sau đó dùng editor.setEditable()
     * vì FormulaBarEditor luôn mounted.
     */
    editable: false,

    autoFocus: false,
  });

  /*
   * Toggle editable.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(editable);
  }, [editor, editable]);

  /*
   * Formula Bar trở thành owner.
   */
  useEffect(() => {
    if (!editor || !editable) {
      return;
    }

    setEditor(editor, cellKey);

    setEditorReady(true);

    editor.commands.focus("end");

    return () => {
      setEditor(null);
    };
  }, [editor, editable, cellKey, setEditor, setEditorReady]);

  /*
   * Formula Bar → dataStore REALTIME.
   *
   * Đây là điểm khác với Cell Editor.
   */
  useEffect(() => {
    if (!editor || !editable) {
      return;
    }

    const handleUpdate = () => {
      setCellContent(cellKey, editor.getJSON());
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, editable, cellKey, setCellContent]);

  /*
   * dataStore/draft → Formula Bar mirror.
   *
   * Không chạy khi Formula Bar đang edit,
   * vì lúc đó chính Tiptap Formula Bar là source of truth.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    if (editable) {
      return;
    }

    const cellChanged = previousCellKeyRef.current !== cellKey;

    previousCellKeyRef.current = cellKey;

    const currentContent = JSON.stringify(editor.getJSON());

    const nextContent = JSON.stringify(content);

    /*
     * Không setContent nếu nội dung
     * thực tế đã giống nhau.
     */
    if (!cellChanged && currentContent === nextContent) {
      return;
    }

    editor.commands.setContent(content, {
      emitUpdate: false,
    });
  }, [editor, editable, cellKey, content]);

  if (!editor) {
    return null;
  }

  return <RichTextEditor editor={editor} />;
}
