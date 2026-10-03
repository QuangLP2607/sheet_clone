import type { JSONContent } from "@tiptap/core";
import { Editor } from "@tiptap/core";

import StarterKit from "@tiptap/starter-kit";

import {
  Color,
  FontFamily,
  FontSize,
  TextStyle as TiptapTextStyle,
} from "@tiptap/extension-text-style";

import TextAlign from "@tiptap/extension-text-align";

import type { TextStyle as CellTextStyle } from "@/features/spreadsheet/types";

import { applyTextStylePatch } from "./applyTextStylePatch";

const extensions = [
  StarterKit,
  TiptapTextStyle,
  Color,
  FontSize,
  FontFamily,
  TextAlign.configure({
    types: ["paragraph", "heading"],
  }),
];

export function transformContentTextStyle(
  content: JSONContent,
  patch: Partial<CellTextStyle>,
): JSONContent {
  const editor = new Editor({
    extensions,
    content,
  });

  try {
    applyTextStylePatch(editor, patch, {
      selectAll: true,
    });

    return editor.getJSON();
  } finally {
    editor.destroy();
  }
}
