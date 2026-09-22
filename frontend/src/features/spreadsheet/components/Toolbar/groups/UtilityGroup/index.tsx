import ToolGroup, { type ToolGroupMode } from "../../base/ToolGroup";

import Undo from "./components/Undo";
import Redo from "./components/Redo";
import Zoom from "./components/Zoom";

interface UtilityGroupProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  mode?: ToolGroupMode;
}

export default function UtilityGroup({
  zoom,
  setZoom,
  mode = "toolbar",
}: UtilityGroupProps) {
  const handleUndo = () => {
    // undo logic
  };

  const handleRedo = () => {
    // redo logic
  };

  return (
    <ToolGroup mode={mode}>
      <Undo onClick={handleUndo} />

      <Redo onClick={handleRedo} />

      <Zoom value={zoom} onChange={setZoom} />
    </ToolGroup>
  );
}
