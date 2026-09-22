import { useEditorState, type Editor } from "@tiptap/react";

import type { TextStyle } from "@/types/richText";

const DEFAULT_TEXT_STYLE: TextStyle = {
  bold: false,
  italic: false,
  strike: false,
  fontFamily: null,
  fontSize: 14,
  color: "#000000",
};

export const useTextStyle = (editor: Editor | null): TextStyle => {
  const textStyle = useEditorState({
    editor,

    selector: ({ editor }) => {
      if (!editor) {
        return DEFAULT_TEXT_STYLE;
      }

      const attrs = editor.getAttributes("textStyle");

      return {
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        strike: editor.isActive("strike"),

        // null = dùng font mặc định của Cell
        fontFamily: attrs.fontFamily ?? null,

        // luôn là number
        fontSize:
          typeof attrs.fontSize === "number"
            ? attrs.fontSize
            : typeof attrs.fontSize === "string"
              ? Number.parseFloat(attrs.fontSize) || 14
              : 14,

        // luôn là string
        color: attrs.color ?? "#000000",
      };
    },
  });

  return textStyle ?? DEFAULT_TEXT_STYLE;
};
