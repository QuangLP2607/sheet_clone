import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Color,
  FontSize,
  FontFamily,
  TextStyle,
} from "@tiptap/extension-text-style";

export const useRichTextEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, FontSize, FontFamily],
    content: "<p></p>",
    editorProps: {
      attributes: {
        spellcheck: "false",
      },
    },
  });

  return editor;
};
