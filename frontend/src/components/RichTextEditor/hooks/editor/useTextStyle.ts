import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

import type { TextStyle } from "@/types/richText";

const DEFAULT_TEXT_STYLE: TextStyle = {
  bold: false,
  italic: false,
  strike: false,
  fontFamily: "Arial",
  fontSize: 14,
  color: null,
};

export const useTextStyle = (editor: Editor | null) => {
  const [textStyle, setTextStyle] = useState<TextStyle>(DEFAULT_TEXT_STYLE);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const updateTextStyle = () => {
      const textStyleAttributes = editor.getAttributes("textStyle");

      setTextStyle({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        strike: editor.isActive("strike"),

        fontFamily:
          textStyleAttributes.fontFamily ?? DEFAULT_TEXT_STYLE.fontFamily,

        fontSize: textStyleAttributes.fontSize
          ? parseInt(textStyleAttributes.fontSize, 10)
          : DEFAULT_TEXT_STYLE.fontSize,

        color: textStyleAttributes.color ?? DEFAULT_TEXT_STYLE.color,
      });
    };

    updateTextStyle();

    editor.on("selectionUpdate", updateTextStyle);
    editor.on("transaction", updateTextStyle);

    return () => {
      editor.off("selectionUpdate", updateTextStyle);
      editor.off("transaction", updateTextStyle);
    };
  }, [editor]);

  return textStyle;
};
