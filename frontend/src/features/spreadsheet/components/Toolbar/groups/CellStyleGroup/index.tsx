import ToolGroup, { type ToolGroupMode } from "../../base/ToolGroup";

import FillColor from "./components/FillColor";
import Borders from "./components/Borders";
import MergeCells from "./components/MergeCells";

import type { CellStyle } from "@/types/cell-style";

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
        color={cellStyle.fillColor}
        setColor={(color) => updateCellStyle({ fillColor: color })}
      />

      <Borders />
      <MergeCells />
    </ToolGroup>
  );
}
