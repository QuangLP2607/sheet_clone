import { useState } from "react";
import type { Editor } from "@tiptap/react";
import classNames from "classnames/bind";

import Toolbar from "@/components/Toolbar";
import RichTextEditor from "@/components/RichTextEditor";

import {
  useRichTextEditor,
  useTextStyle,
  useBold,
  useItalic,
  useStrike,
  useColor,
  useFontSize,
  useFontFamily,
} from "@/components/RichTextEditor/hooks";

import styles from "./SharedToolbar.module.scss";

const cx = classNames.bind(styles);

export default function SharedToolbar() {
  const editorLeft = useRichTextEditor();
  const editorRight = useRichTextEditor();

  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);

  const textStyle = useTextStyle(activeEditor);

  const { onBoldClick } = useBold(activeEditor);
  const { onItalicClick } = useItalic(activeEditor);
  const { onStrikeClick } = useStrike(activeEditor);

  const { onColorChange } = useColor(activeEditor);
  const { onFontSizeChange } = useFontSize(activeEditor);
  const { onFontFamilyChange } = useFontFamily(activeEditor);

  const setColor = (color: string | null) => {
    if (color) {
      onColorChange(color);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <Toolbar
        textStyle={textStyle}
        toggleBold={onBoldClick}
        toggleItalic={onItalicClick}
        toggleStrike={onStrikeClick}
        setColor={setColor}
        setFontSize={onFontSizeChange}
        setFontFamily={onFontFamilyChange}
      />

      <div className={cx("sheet")}>
        <div
          className={cx("cell")}
          onFocusCapture={() => setActiveEditor(editorLeft)}
        >
          <RichTextEditor editor={editorLeft} className={cx("cellEditor")} />
        </div>

        <div
          className={cx("cell")}
          onFocusCapture={() => setActiveEditor(editorRight)}
        >
          <RichTextEditor editor={editorRight} className={cx("cellEditor")} />
        </div>
      </div>
    </div>
  );
}
