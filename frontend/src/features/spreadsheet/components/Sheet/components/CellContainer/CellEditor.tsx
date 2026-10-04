import { useEffect } from "react";

import type { Editor, JSONContent } from "@tiptap/core";

import RichTextEditor from "@/features/spreadsheet/components/RichTextEditor";

import { useRichTextEditor } from "@/features/spreadsheet/components/RichTextEditor/hooks";

import { useEditingEditor } from "@/features/spreadsheet/providers/EditingEditor";

import type { CellKey, TextStyle } from "@/features/spreadsheet/types";

interface CellEditorProps {
  cellKey: CellKey;
  content: JSONContent;
  textStyle: TextStyle;

  /**
   * Called after Tiptap content changes.
   *
   * CellEditorOverlay uses the same Tiptap instance
   * to determine whether the content needs more columns.
   */
  onContentUpdate?: (editor: Editor) => void;
}

export default function CellEditor({
  cellKey,
  content,
  textStyle,
  onContentUpdate,
}: CellEditorProps) {
  const { setEditor, setEditorReady, setDraftContent, commitEditorContent } =
    useEditingEditor();

  const editor = useRichTextEditor({
    content,

    initialTextStyle: textStyle,

    editable: true,

    autoFocus: true,

    onReady: () => {
      setEditorReady(true);
    },
  });

  /*
   * Register current editing editor.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    setEditor(editor, cellKey);

    return () => {
      /*
       * Draft → dataStore.
       */
      commitEditorContent();

      setEditor(null);
    };
  }, [editor, cellKey, setEditor, commitEditorContent]);

  /*
   * Tiptap → draft.
   *
   * CellEditorOverlay is notified using the SAME
   * Tiptap instance. No second editor is created.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    const handleUpdate = () => {
      setDraftContent(editor.getJSON());

      onContentUpdate?.(editor);
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, setDraftContent, onContentUpdate]);

  if (!editor) {
    return null;
  }

  return <RichTextEditor editor={editor} />;
}
