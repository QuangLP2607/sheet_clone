import ToolGroup, { type ToolGroupMode } from "../../base/ToolGroup";
import FontPicker from "@/components/FontPicker";

interface FontGroupProps {
  value: string | null;
  onChange: (fontFamily: string | null) => void;
  mode?: ToolGroupMode;
}

export default function FontGroup({
  value,
  onChange,
  mode = "toolbar",
}: FontGroupProps) {
  return (
    <ToolGroup mode={mode}>
      <FontPicker value={value} onChange={onChange} defaultFont="Arial" />
    </ToolGroup>
  );
}
