import { useEffect } from "react";

import type { JSONContent } from "@tiptap/core";

import RichTextEditor from "@/features/spreadsheet/components/RichTextEditor";

import { useRichTextEditor } from "@/features/spreadsheet/components/RichTextEditor/hooks";

import { useEditingEditor } from "@/features/spreadsheet/providers/EditingEditor";

import type { CellKey, TextStyle } from "@/features/spreadsheet/types";

interface CellEditorProps {
  cellKey: CellKey;

  content: JSONContent;

  textStyle: TextStyle;
}

export default function CellEditor({
  cellKey,
  content,
  textStyle,
}: CellEditorProps) {
  const {
    setEditor,

    setEditorReady,

    setDraftContent,

    commitEditorContent,
  } = useEditingEditor();

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
   * Register Cell Editor.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    setEditor(editor, cellKey);

    return () => {
      /*
       * Cell editing kết thúc.
       *
       * Commit draft → dataStore.
       */
      commitEditorContent();

      setEditor(null);
    };
  }, [editor, cellKey, setEditor, commitEditorContent]);

  /*
   * Cell Editor → draft.
   *
   * Không update dataStore.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    const handleUpdate = () => {
      setDraftContent(editor.getJSON());
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, setDraftContent]);

  if (!editor) {
    return null;
  }

  return <RichTextEditor editor={editor} />;
}
