import type { JSONContent } from "@tiptap/core";
import { useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import {
  Color,
  FontFamily,
  FontSize,
  TextStyle,
} from "@tiptap/extension-text-style";

const extensions = [StarterKit, TextStyle, Color, FontSize, FontFamily];

export function useRichTextEditor(content: JSONContent) {
  return useEditor({
    extensions,
    content,

    editorProps: {
      attributes: {
        spellcheck: "false",
      },
    },
  });
}
