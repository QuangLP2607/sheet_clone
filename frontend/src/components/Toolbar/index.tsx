import classNames from "classnames/bind";

import TextStyleGroup from "./groups/TextStyleGroup";
import FontSizeGroup from "./groups/FontSizeGroup";
import FontGroup from "./groups/FontGroup";

import type { TextStyle } from "@/types/richText";

import styles from "./toolbar.module.scss";

const cx = classNames.bind(styles);

export interface ToolbarProps {
  textStyle: TextStyle;

  toggleBold: () => void;
  toggleItalic: () => void;
  toggleStrike: () => void;

  setColor: (color: string | null) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (fontFamily: string) => void;
}

export default function Toolbar({
  textStyle,
  toggleBold,
  toggleItalic,
  toggleStrike,
  setColor,
  setFontSize,
  setFontFamily,
}: ToolbarProps) {
  return (
    <div className={cx("toolbar")}>
      <FontGroup value={textStyle.fontFamily} onChange={setFontFamily} />

      <FontSizeGroup textStyle={textStyle} setFontSize={setFontSize} />

      <TextStyleGroup
        textStyle={textStyle}
        toggleBold={toggleBold}
        toggleItalic={toggleItalic}
        toggleStrike={toggleStrike}
        setColor={setColor}
      />
    </div>
  );
}
