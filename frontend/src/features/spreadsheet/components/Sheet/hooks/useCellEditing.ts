// import { useCallback, useEffect, useRef } from "react";

// import type { JSONContent } from "@tiptap/core";

// import {
//   DEFAULT_CELL_CONTENT,
//   type CellKey,
// } from "@/features/spreadsheet/types";

// import { useDataStore } from "@/features/spreadsheet/stores/dataStore";
// import { useSelectionStore } from "@/features/spreadsheet/stores/selectionStore";

// interface EditingSession {
//   cellKey: CellKey;
//   content: JSONContent;
// }

// export function useCellEditing() {
//   const sessionRef = useRef<EditingSession | null>(null);

//   const updateContent = useCallback((content: JSONContent) => {
//     const session = sessionRef.current;

//     if (!session) {
//       return;
//     }

//     sessionRef.current = {
//       ...session,
//       content,
//     };
//   }, []);

//   useEffect(() => {
//     const startSession = (cellKey: CellKey) => {
//       const cell = useDataStore.getState().cells[cellKey];

//       sessionRef.current = {
//         cellKey,
//         content: cell?.content ?? DEFAULT_CELL_CONTENT,
//       };
//     };

//     const finishSession = () => {
//       const session = sessionRef.current;

//       if (!session) {
//         return;
//       }

//       useDataStore.getState().setCellContent(session.cellKey, session.content);

//       sessionRef.current = null;
//     };

//     /*
//      * Khôi phục session nếu hook được mount
//      * trong lúc đang có cell edit.
//      */
//     const currentEditingCellKey = useSelectionStore.getState().editingCellKey;

//     if (currentEditingCellKey) {
//       startSession(currentEditingCellKey);
//     }

//     /*
//      * Theo dõi editingCellKey mà không subscribe
//      * React component vào Zustand.
//      *
//      * Vì vậy Sheet không rerender khi editingCellKey thay đổi.
//      */
//     const unsubscribe = useSelectionStore.subscribe((state, previousState) => {
//       const previousCellKey = previousState.editingCellKey;
//       const nextCellKey = state.editingCellKey;

//       if (previousCellKey === nextCellKey) {
//         return;
//       }

//       /*
//        * Editing session cũ kết thúc.
//        *
//        * A1 -> A2
//        * A1 -> null
//        */
//       if (sessionRef.current) {
//         finishSession();
//       }

//       /*
//        * Không có cell mới đang edit.
//        */
//       if (!nextCellKey) {
//         return;
//       }

//       /*
//        * Bắt đầu session mới.
//        */
//       startSession(nextCellKey);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   return {
//     updateContent,
//   };
// }
