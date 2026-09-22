import type { Editor } from "@tiptap/react";

export const useFontFamily = (editor: Editor | null) => {
  const onFontFamilyChange = (fontFamily: string | null) => {
    if (!editor) return;

    if (fontFamily === null) {
      editor.chain().focus().unsetFontFamily().run();
      return;
    }

    editor.chain().focus().setFontFamily(fontFamily).run();
  };

  return {
    onFontFamilyChange,
  };
};
