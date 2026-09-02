import ToolGroup from "../../base/ToolGroup";

import FontSize from "./components/FontSize";

import type { TextStyle } from "@/types/richText";

interface FontSizeGroupProps {
  textStyle: TextStyle;
  setFontSize: (fontSize: number) => void;
}

export default function FontSizeGroup({
  textStyle,
  setFontSize,
}: FontSizeGroupProps) {
  return (
    <ToolGroup>
      <FontSize value={textStyle.fontSize} onChange={setFontSize} />
    </ToolGroup>
  );
}
