import FontPicker from "@/components/FontPicker";
import {
  type TextStyle,
  DEFAULT_TEXT_STYLE,
} from "@/features/spreadsheet/types";

import ToolGroup, { type ToolGroupMode } from "../../base/ToolGroup";

interface FontGroupProps {
  textStyle: TextStyle;
  updateTextStyle: (patch: Partial<TextStyle>) => void;
  mode?: ToolGroupMode;
}

export default function FontGroup({
  textStyle,
  updateTextStyle,
  mode = "toolbar",
}: FontGroupProps) {
  return (
    <ToolGroup mode={mode}>
      <FontPicker
        value={textStyle.fontFamily}
        onChange={(fontFamily) => updateTextStyle({ fontFamily })}
        defaultFont={DEFAULT_TEXT_STYLE.fontFamily}
      />
    </ToolGroup>
  );
}
