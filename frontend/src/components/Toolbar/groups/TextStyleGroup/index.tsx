import ToolGroup from "../../base/ToolGroup";

import Bold from "./components/Bold";
import Italic from "./components/Italic";
import Strike from "./components/Strike";
import TextColor from "./components/TextColor";

import type { TextStyle } from "@/types/richText";

export interface TextStyleGroupProps {
  textStyle: TextStyle;
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleStrike: () => void;
  setColor: (color: string | null) => void;
}

export default function TextStyleGroup({
  textStyle,
  toggleBold,
  toggleItalic,
  toggleStrike,
  setColor,
}: TextStyleGroupProps) {
  return (
    <ToolGroup>
      <Bold active={textStyle.bold} onClick={toggleBold} />

      <Italic active={textStyle.italic} onClick={toggleItalic} />

      <Strike active={textStyle.strike} onClick={toggleStrike} />

      <TextColor color={textStyle.color} setColor={setColor} />
    </ToolGroup>
  );
}
