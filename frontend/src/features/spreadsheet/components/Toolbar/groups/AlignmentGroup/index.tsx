import ToolGroup, { type ToolGroupMode } from "../../base/ToolGroup";

import HorizontalAlign from "./components/HorizontalAlign";
import VerticalAlign from "./components/VerticalAlign";
import TextWrapping from "./components/TextWrapping";
import TextRotation from "./components/TextRotation";

import type { CellStyle } from "@/types/cell-style";

interface AlignmentGroupProps {
  cellStyle: CellStyle;
  updateCellStyle: (patch: Partial<CellStyle>) => void;
  mode?: ToolGroupMode;
}

export default function AlignmentGroup({
  cellStyle,
  updateCellStyle,
  mode = "toolbar",
}: AlignmentGroupProps) {
  return (
    <ToolGroup mode={mode}>
      <HorizontalAlign
        value={cellStyle.horizontalAlign}
        onChange={(horizontalAlign) => updateCellStyle({ horizontalAlign })}
      />

      <VerticalAlign
        value={cellStyle.verticalAlign}
        onChange={(verticalAlign) => updateCellStyle({ verticalAlign })}
      />

      <TextWrapping
        value={cellStyle.textWrapping}
        onChange={(textWrapping) => updateCellStyle({ textWrapping })}
      />

      <TextRotation />
    </ToolGroup>
  );
}
