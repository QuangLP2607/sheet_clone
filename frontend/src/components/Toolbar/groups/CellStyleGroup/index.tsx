import ToolGroup from "../../base/ToolGroup";

import FillColor from "./components/FillColor";
import Borders from "./components/Borders";
import MergeCells from "./components/MergeCells";

export default function TextStyleGroup() {
  return (
    <ToolGroup>
      <FillColor color={null} setColor={() => {}} />
      <Borders />
      <MergeCells />
    </ToolGroup>
  );
}
