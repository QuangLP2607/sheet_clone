import type { Editor } from "@tiptap/react";

import type { CellStyle } from "@/types/cell-style";

import {
  useBold as useCellBold,
  useItalic as useCellItalic,
  useStrike as useCellStrike,
  useColor as useCellColor,
  useFontSize as useCellFontSize,
  useFontFamily as useCellFontFamily,
  useFillColor as useCellFillColor,
  useVerticalAlign as useCellVerticalAlign,
  useHorizontalAlign as useCellHorizontalAlign,
  useTextWrapping as useCellTextWrapping,
} from "@/features/spreadsheet/components/Cell/hooks";

import {
  useBold as useTextBold,
  useItalic as useTextItalic,
  useStrike as useTextStrike,
  useColor as useTextColor,
  useFontSize as useTextFontSize,
  useFontFamily as useTextFontFamily,
  useTextStyle,
} from "@/features/spreadsheet/components/RichTextEditor/hooks";

import { useCellStyleSync } from "@/features/spreadsheet/style-sync/useCellStyleSync";

interface UseToolbarProps {
  editing: boolean;
  cellKey: string | null;
  editor: Editor | null;
  cellStyle: CellStyle;
  updateCellStyle: (patch: Partial<CellStyle>) => void;
}

export const useToolbar = ({
  editing,
  cellKey,
  editor,
  cellStyle,
  updateCellStyle,
}: UseToolbarProps) => {
  /*
   * ==================================================
   * Cell commands
   * ==================================================
   */

  const cellBold = useCellBold(cellStyle, updateCellStyle);

  const cellItalic = useCellItalic(cellStyle, updateCellStyle);

  const cellStrike = useCellStrike(cellStyle, updateCellStyle);

  const cellColor = useCellColor(updateCellStyle);

  const cellFontSize = useCellFontSize(updateCellStyle);

  const cellFontFamily = useCellFontFamily(updateCellStyle);

  const cellFillColor = useCellFillColor(updateCellStyle);

  const cellVerticalAlign = useCellVerticalAlign(updateCellStyle);

  const cellHorizontalAlign = useCellHorizontalAlign(updateCellStyle);

  const cellTextWrapping = useCellTextWrapping(updateCellStyle);

  /*
   * ==================================================
   * Rich text commands
   * ==================================================
   */

  const textStyle = useTextStyle(editor);

  const textBold = useTextBold(editor);

  const textItalic = useTextItalic(editor);

  const textStrike = useTextStrike(editor);

  const textColor = useTextColor(editor);

  const textFontSize = useTextFontSize(editor);

  const textFontFamily = useTextFontFamily(editor);

  /*
   * ==================================================
   * Cell Style <-> Rich Text synchronization
   * ==================================================
   */

  useCellStyleSync({
    editor,
    editing,
    cellKey,
    cellStyle,
    onCellStyleChange: updateCellStyle,
  });

  /*
   * ==================================================
   * Public commands
   * ==================================================
   */

  const toggleBold = () => {
    if (editing) {
      textBold.onBoldClick();
      return;
    }

    cellBold.onBoldClick();
  };

  const toggleItalic = () => {
    if (editing) {
      textItalic.onItalicClick();
      return;
    }

    cellItalic.onItalicClick();
  };

  const toggleStrike = () => {
    if (editing) {
      textStrike.onStrikeClick();
      return;
    }

    cellStrike.onStrikeClick();
  };

  const setColor = (color: string | null) => {
    if (color === null) {
      return;
    }

    if (editing) {
      textColor.onColorChange(color);
      return;
    }

    cellColor.onColorChange(color);
  };

  const setFontSize = (fontSize: number) => {
    if (editing) {
      textFontSize.onFontSizeChange(fontSize);
      return;
    }

    cellFontSize.onFontSizeChange(fontSize);
  };

  const setFontFamily = (fontFamily: string | null) => {
    if (fontFamily === null) {
      return;
    }

    if (editing) {
      textFontFamily.onFontFamilyChange(fontFamily);
      return;
    }

    cellFontFamily.onFontFamilyChange(fontFamily);
  };

  const setFillColor = (color: string | null) => {
    if (editing) {
      return;
    }

    cellFillColor.onFillColorChange(color);
  };

  const setVerticalAlign = (verticalAlign: CellStyle["verticalAlign"]) => {
    if (editing) {
      return;
    }

    cellVerticalAlign.onVerticalAlignChange(verticalAlign);
  };

  const setHorizontalAlign = (
    horizontalAlign: CellStyle["horizontalAlign"],
  ) => {
    if (editing) {
      return;
    }

    cellHorizontalAlign.onHorizontalAlignChange(horizontalAlign);
  };

  const setTextWrapping = (textWrapping: CellStyle["textWrapping"]) => {
    if (editing) {
      return;
    }

    cellTextWrapping.onTextWrappingChange(textWrapping);
  };

  /*
   * ==================================================
   * Current style shown by Toolbar
   * ==================================================
   */

  const currentTextStyle = editing ? textStyle : cellStyle;

  return {
    textStyle: currentTextStyle,

    toggleBold,
    toggleItalic,
    toggleStrike,

    setColor,
    setFontSize,
    setFontFamily,

    setFillColor,

    setVerticalAlign,
    setHorizontalAlign,
    setTextWrapping,
  };
};
