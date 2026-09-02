import type { Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";
import classNames from "classnames/bind";

import styles from "./RichTextEditor.module.scss";

const cx = classNames.bind(styles);

interface RichTextEditorProps {
  editor: Editor | null;
  className?: string;
}

const RichTextEditor = ({ editor, className }: RichTextEditorProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={cx("editor", className)}>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
