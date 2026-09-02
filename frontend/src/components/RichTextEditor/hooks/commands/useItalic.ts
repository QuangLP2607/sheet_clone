import type { Editor } from "@tiptap/react";

export const useItalic = (editor: Editor | null) => {
  const onItalicClick = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  return {
    onItalicClick,
  };
};
