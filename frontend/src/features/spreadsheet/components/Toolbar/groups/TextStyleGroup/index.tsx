import ToolGroup, { type ToolGroupMode } from "../../base/ToolGroup";

import Bold from "./components/Bold";
import Italic from "./components/Italic";
import Strike from "./components/Strike";
import TextColor from "./components/TextColor";

import type { TextStyle } from "@/features/spreadsheet/types";

export interface TextStyleGroupProps {
  textStyle: TextStyle;
  updateTextStyle: (patch: Partial<TextStyle>) => void;
  mode?: ToolGroupMode;
}

export default function TextStyleGroup({
  textStyle,
  updateTextStyle,
  mode = "toolbar",
}: TextStyleGroupProps) {
  return (
    <ToolGroup mode={mode}>
      <Bold value={textStyle.bold} updateTextStyle={updateTextStyle} />

      <Italic value={textStyle.italic} updateTextStyle={updateTextStyle} />

      <Strike value={textStyle.strike} updateTextStyle={updateTextStyle} />

      <TextColor value={textStyle.color} updateTextStyle={updateTextStyle} />
    </ToolGroup>
  );
}
