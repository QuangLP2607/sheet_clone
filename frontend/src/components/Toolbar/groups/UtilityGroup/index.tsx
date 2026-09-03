import ToolGroup from "../../base/ToolGroup";

import Undo from "./components/Undo";
import Redo from "./components/Redo";

export default function HistoryGroup() {
  const handleUndo = () => {
    // undo logic
  };

  const handleRedo = () => {
    // redo logic
  };

  return (
    <ToolGroup>
      <Undo onClick={handleUndo} />
      <Redo onClick={handleRedo} />
    </ToolGroup>
  );
}
