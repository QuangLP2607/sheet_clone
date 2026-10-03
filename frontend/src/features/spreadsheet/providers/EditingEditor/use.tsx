import { useContext } from "react";

import { EditingEditorContext } from "./context";

export function useEditingEditor() {
  const context = useContext(EditingEditorContext);

  if (!context) {
    throw new Error(
      "useEditingEditor must be used within EditingEditorProvider",
    );
  }

  return context;
}
