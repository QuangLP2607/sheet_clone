import ToolGroup, { type ToolGroupMode } from "../../base/ToolGroup";
import FontSize from "./components/FontSize";

import type { TextStyle } from "@/types/richText";

interface FontSizeGroupProps {
  textStyle: TextStyle;
  setFontSize: (fontSize: number) => void;
  mode?: ToolGroupMode;
}

export default function FontSizeGroup({
  textStyle,
  setFontSize,
  mode = "toolbar",
}: FontSizeGroupProps) {
  return (
    <ToolGroup mode={mode}>
      <FontSize value={textStyle.fontSize} onChange={setFontSize} />
    </ToolGroup>
  );
}
