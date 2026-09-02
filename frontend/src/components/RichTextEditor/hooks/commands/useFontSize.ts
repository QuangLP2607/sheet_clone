import type { Editor } from "@tiptap/react";

export const useFontSize = (editor: Editor | null) => {
  const onFontSizeChange = (fontSize: number) => {
    editor?.chain().focus().setFontSize(`${fontSize}px`).run();
  };

  const onFontSizeReset = () => {
    editor?.chain().focus().unsetFontSize().run();
  };

  return {
    onFontSizeChange,
    onFontSizeReset,
  };
};
