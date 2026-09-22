import { Icon } from "@iconify/react";

import ToolbarButton from "../../../../base/ToolButton";

interface UndoProps {
  disabled?: boolean;
  onClick: () => void;
}

export default function Undo({ disabled = false, onClick }: UndoProps) {
  return (
    <ToolbarButton disabled={disabled} onClick={onClick}>
      <Icon icon="material-symbols:undo" />
    </ToolbarButton>
  );
}
