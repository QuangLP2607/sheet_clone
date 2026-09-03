import { Icon } from "@iconify/react";

import ToolbarButton from "../../../../base/ToolButton";

interface RedoProps {
  disabled?: boolean;
  onClick: () => void;
}

export default function Redo({ disabled = false, onClick }: RedoProps) {
  return (
    <ToolbarButton disabled={disabled} onClick={onClick}>
      <Icon icon="material-symbols:redo" />
    </ToolbarButton>
  );
}
