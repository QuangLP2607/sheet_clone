import ToolGroup, { type ToolGroupMode } from "../../base/ToolGroup";

import FillColor from "./components/FillColor";
import Borders from "./components/Borders";
import MergeCells from "./components/MergeCells";

import type { CellStyle } from "@/features/spreadsheet/types";

interface CellStyleGroupProps {
  cellStyle: CellStyle;
  updateCellStyle: (patch: Partial<CellStyle>) => void;
  mode?: ToolGroupMode;
}

export default function CellStyleGroup({
  cellStyle,
  updateCellStyle,
  mode = "toolbar",
}: CellStyleGroupProps) {
  return (
    <ToolGroup mode={mode}>
      <FillColor
        value={cellStyle.fillColor}
        updateCellStyle={updateCellStyle}
      />

      <Borders />
      <MergeCells />
    </ToolGroup>
  );
}
