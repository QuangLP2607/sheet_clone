import ToolGroup from "../../base/ToolGroup";

import HorizontalAlign from "./components/HorizontalAlign";
import VerticalAlign from "./components/VerticalAlign";
import TextWrapping from "./components/TextWrapping";
import TextRotation from "./components/TextRotation";

export default function TextStyleGroup() {
  return (
    <ToolGroup>
      <HorizontalAlign />
      <VerticalAlign />
      <TextWrapping />
      <TextRotation />
    </ToolGroup>
  );
}
