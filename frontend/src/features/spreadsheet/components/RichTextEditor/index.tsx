import type { Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";

import classNames from "classnames/bind";

import styles from "./RichTextEditor.module.scss";

const cx = classNames.bind(styles);

interface RichTextEditorProps {
  editor: Editor;
  className?: string;
}

export default function RichTextEditor({
  editor,
  className,
}: RichTextEditorProps) {
  return (
    <div className={cx("editor", className)}>
      <EditorContent editor={editor} />
    </div>
  );
}
