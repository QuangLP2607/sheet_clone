import ToolGroup from "../../base/ToolGroup";
import FontPicker from "@/components/FontPicker";

interface FontGroupProps {
  value: string;
  onChange: (fontFamily: string) => void;
}

export default function FontGroup({ value, onChange }: FontGroupProps) {
  return (
    <ToolGroup>
      <FontPicker value={value} onChange={onChange} />
    </ToolGroup>
  );
}
