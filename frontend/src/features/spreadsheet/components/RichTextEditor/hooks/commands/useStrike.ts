import type { Editor } from "@tiptap/react";

export const useStrike = (editor: Editor | null) => {
  const onStrikeClick = () => {
    editor?.chain().focus().toggleStrike().run();
  };

  return {
    onStrikeClick,
  };
};
