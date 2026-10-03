import ToolGroup, { type ToolGroupMode } from "../../base/ToolGroup";
import FontSize from "./components/FontSize";
import type { TextStyle } from "@/features/spreadsheet/types";

interface FontSizeGroupProps {
  textStyle: TextStyle;
  updateTextStyle: (patch: Partial<TextStyle>) => void;
  mode?: ToolGroupMode;
}

export default function FontSizeGroup({
  textStyle,
  updateTextStyle,
  mode = "toolbar",
}: FontSizeGroupProps) {
  return (
    <ToolGroup mode={mode}>
      <FontSize value={textStyle.fontSize} updateTextStyle={updateTextStyle} />
    </ToolGroup>
  );
}
