import { useEffect } from "react";

import type { Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";

import classNames from "classnames/bind";

import styles from "./RichTextEditor.module.scss";

const cx = classNames.bind(styles);

interface RichTextEditorProps {
  editor: Editor | null;
  className?: string;
  onFocus?: (editor: Editor) => void;
}

export default function RichTextEditor({
  editor,
  className,
  onFocus,
}: RichTextEditorProps) {
  useEffect(() => {
    if (!editor || !onFocus) {
      return;
    }

    const handleFocus = () => {
      onFocus(editor);
    };

    editor.on("focus", handleFocus);

    return () => {
      editor.off("focus", handleFocus);
    };
  }, [editor, onFocus]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cx("editor", className)}>
      <EditorContent editor={editor} />
    </div>
  );
}
