import { useEditor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";

import StarterKit from "@tiptap/starter-kit";

import {
  Color,
  FontFamily,
  FontSize,
  TextStyle,
} from "@tiptap/extension-text-style";

import TextAlign from "@tiptap/extension-text-align";

import type { TextStyle as CellTextStyle } from "@/features/spreadsheet/types";

const extensions = [
  StarterKit,
  TextStyle,
  Color,
  FontSize,
  FontFamily,
  TextAlign.configure({
    types: ["paragraph", "heading"],
  }),
];

interface UseRichTextEditorOptions {
  content: JSONContent;
  initialTextStyle?: CellTextStyle;

  editable?: boolean;
  autoFocus?: boolean;

  onReady?: () => void;
}

export function useRichTextEditor({
  content,
  initialTextStyle,
  editable = true,
  autoFocus = true,
  onReady,
}: UseRichTextEditorOptions) {
  return useEditor({
    extensions,
    content,

    editable,

    onCreate: ({ editor }) => {
      if (editor.isEmpty && initialTextStyle) {
        if (initialTextStyle.bold) {
          editor.commands.setBold();
        }

        if (initialTextStyle.italic) {
          editor.commands.setItalic();
        }

        if (initialTextStyle.strike) {
          editor.commands.setStrike();
        }

        if (initialTextStyle.fontFamily) {
          editor.commands.setFontFamily(initialTextStyle.fontFamily);
        }

        if (initialTextStyle.fontSize) {
          editor.commands.setFontSize(`${initialTextStyle.fontSize}px`);
        }

        if (initialTextStyle.color) {
          editor.commands.setColor(initialTextStyle.color);
        }
      }

      if (autoFocus && editable) {
        editor.commands.focus("end");
      }

      onReady?.();
    },

    immediatelyRender: false,
    shouldRerenderOnTransaction: false,

    editorProps: {
      attributes: {
        spellcheck: "false",
      },
    },
  });
}
