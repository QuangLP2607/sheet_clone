import type { Editor } from "@tiptap/react";

export const useFontFamily = (editor: Editor | null) => {
  const onFontFamilyChange = (fontFamily: string) => {
    editor?.chain().focus().setFontFamily(fontFamily).run();
  };

  const onFontFamilyReset = () => {
    editor?.chain().focus().unsetFontFamily().run();
  };

  return {
    onFontFamilyChange,
    onFontFamilyReset,
  };
};
