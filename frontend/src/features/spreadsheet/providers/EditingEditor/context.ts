import { createContext } from "react";

import type { JSONContent } from "@tiptap/core";
import type { Editor } from "@tiptap/react";

import type { CellKey, TextStyle } from "@/features/spreadsheet/types";

export interface EditingEditorContextValue {
  editor: Editor | null;

  editingCellKey: CellKey | null;

  editorReady: boolean;

  draftContent: JSONContent | null;

  setEditor: (editor: Editor | null, cellKey?: CellKey) => void;

  setEditorReady: (ready: boolean) => void;

  setDraftContent: (content: JSONContent) => void;

  commitEditorContent: () => void;

  updateEditorTextStyle: (patch: Partial<TextStyle>) => void;

  transformContentTextStyle: (
    content: JSONContent,
    patch: Partial<TextStyle>,
  ) => JSONContent;
}

export const EditingEditorContext =
  createContext<EditingEditorContextValue | null>(null);
