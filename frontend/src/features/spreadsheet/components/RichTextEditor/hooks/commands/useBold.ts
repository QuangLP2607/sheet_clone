import type { Editor } from "@tiptap/react";

export const useBold = (editor: Editor | null) => {
  const onBoldClick = () => {
    editor?.chain().focus().toggleBold().run();
  };

  const isBold = editor?.isActive("bold") ?? false;

  return {
    onBoldClick,
    isBold,
  };
};
