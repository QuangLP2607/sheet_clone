import ToolGroup, { type ToolGroupMode } from "../../base/ToolGroup";

import HorizontalAlign from "./components/HorizontalAlign";
import VerticalAlign from "./components/VerticalAlign";
import TextWrapping from "./components/TextWrapping";
import TextRotation from "./components/TextRotation";

import type { CellStyle } from "@/features/spreadsheet/types";

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
        updateCellStyle={updateCellStyle}
      />

      <VerticalAlign
        value={cellStyle.verticalAlign}
        updateCellStyle={updateCellStyle}
      />

      <TextWrapping
        value={cellStyle.textWrapping}
        updateCellStyle={updateCellStyle}
      />

      <TextRotation
        value={cellStyle.textRotation}
        updateCellStyle={updateCellStyle}
      />
    </ToolGroup>
  );
}
