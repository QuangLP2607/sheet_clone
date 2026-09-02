import type { Editor } from "@tiptap/react";

export const useColor = (editor: Editor | null) => {
  const onColorChange = (color: string) => {
    editor?.chain().focus().setColor(color).run();
  };

  const onColorReset = () => {
    editor?.chain().focus().unsetColor().run();
  };

  return {
    onColorChange,
    onColorReset,
  };
};
