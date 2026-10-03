import type { Editor } from "@tiptap/core";

import type { TextStyle } from "@/features/spreadsheet/types";

interface ApplyTextStylePatchOptions {
  focus?: boolean;
  selectAll?: boolean;
}

export function applyTextStylePatch(
  editor: Editor,
  patch: Partial<TextStyle>,
  options: ApplyTextStylePatchOptions = {},
): void {
  const { focus = false, selectAll = false } = options;

  let chain = editor.chain();

  if (focus) {
    chain = chain.focus();
  }

  if (selectAll) {
    chain = chain.selectAll();
  }

  if (patch.bold !== undefined) {
    if (patch.bold) {
      chain = chain.setBold();
    } else {
      chain = chain.unsetBold();
    }
  }

  if (patch.italic !== undefined) {
    if (patch.italic) {
      chain = chain.setItalic();
    } else {
      chain = chain.unsetItalic();
    }
  }

  if (patch.strike !== undefined) {
    if (patch.strike) {
      chain = chain.setStrike();
    } else {
      chain = chain.unsetStrike();
    }
  }

  if (patch.fontFamily !== undefined) {
    if (patch.fontFamily) {
      chain = chain.setFontFamily(patch.fontFamily);
    } else {
      chain = chain.unsetFontFamily();
    }
  }

  if (patch.fontSize !== undefined) {
    chain = chain.setFontSize(`${patch.fontSize}px`);
  }

  if (patch.color !== undefined) {
    chain = chain.setColor(patch.color);
  }

  if (patch.textAlign !== undefined) {
    chain = chain.setTextAlign(patch.textAlign);
  }

  chain.run();
}
