import { useEditorState, type Editor } from "@tiptap/react";

import {
  type TextStyle,
  DEFAULT_TEXT_STYLE,
} from "@/features/spreadsheet/types";

function getStoredMark(editor: Editor, markName: string) {
  return editor.state.storedMarks?.find((mark) => mark.type.name === markName);
}

export function useTextStyle(editor: Editor | null): TextStyle {
  return (
    useEditorState({
      editor,

      selector: ({ editor }) => {
        if (!editor) {
          return DEFAULT_TEXT_STYLE;
        }

        const storedTextStyle = getStoredMark(editor, "textStyle");

        const paragraphAttrs = editor.getAttributes("paragraph");

        const textStyleAttrs =
          storedTextStyle?.attrs ?? editor.getAttributes("textStyle");

        const fontSize =
          typeof textStyleAttrs.fontSize === "number"
            ? textStyleAttrs.fontSize
            : typeof textStyleAttrs.fontSize === "string"
              ? Number.parseFloat(textStyleAttrs.fontSize) ||
                DEFAULT_TEXT_STYLE.fontSize
              : DEFAULT_TEXT_STYLE.fontSize;

        return {
          bold:
            getStoredMark(editor, "bold") !== undefined ||
            editor.isActive("bold"),

          italic:
            getStoredMark(editor, "italic") !== undefined ||
            editor.isActive("italic"),

          strike:
            getStoredMark(editor, "strike") !== undefined ||
            editor.isActive("strike"),

          fontFamily:
            textStyleAttrs.fontFamily ?? DEFAULT_TEXT_STYLE.fontFamily,

          fontSize,

          color: textStyleAttrs.color ?? DEFAULT_TEXT_STYLE.color,

          textAlign: paragraphAttrs.textAlign ?? DEFAULT_TEXT_STYLE.textAlign,
        };
      },
    }) ?? DEFAULT_TEXT_STYLE
  );
}
