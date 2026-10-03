import type { Editor } from "@tiptap/core";
import type { TextStyle } from "@/features/spreadsheet/types";

export function applyCellTextStyle(editor: Editor, textStyle: TextStyle): void {
  let chain = editor.chain().focus();

  if (textStyle.bold) {
    chain = chain.setBold();
  }

  if (textStyle.italic) {
    chain = chain.setItalic();
  }

  if (textStyle.strike) {
    chain = chain.setStrike();
  }

  if (textStyle.fontFamily) {
    chain = chain.setFontFamily(textStyle.fontFamily);
  }

  if (textStyle.fontSize) {
    chain = chain.setFontSize(`${textStyle.fontSize}px`);
  }

  if (textStyle.color) {
    chain = chain.setColor(textStyle.color);
  }

  if (textStyle.textAlign) {
    chain = chain.setTextAlign(textStyle.textAlign);
  }

  chain.run();
}
