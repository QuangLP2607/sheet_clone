// import type { JSONContent } from "@tiptap/core";
// import { Editor } from "@tiptap/core";

// import StarterKit from "@tiptap/starter-kit";

// import {
//   Color,
//   FontFamily,
//   FontSize,
//   TextStyle,
// } from "@tiptap/extension-text-style";

// import type { TextStyle as CellTextStyle } from "@/features/spreadsheet/types";

// const extensions = [StarterKit, TextStyle, Color, FontSize, FontFamily];

// export function updateContentTextStyle(
//   content: JSONContent,
//   patch: Partial<CellTextStyle>,
// ): JSONContent {
//   const editor = new Editor({
//     extensions,
//     content,
//   });

//   try {
//     editor.commands.selectAll();

//     const chain = editor.chain();

//     if (patch.bold !== undefined) {
//       if (patch.bold) {
//         chain.setBold();
//       } else {
//         chain.unsetBold();
//       }
//     }

//     if (patch.italic !== undefined) {
//       if (patch.italic) {
//         chain.setItalic();
//       } else {
//         chain.unsetItalic();
//       }
//     }

//     if (patch.strike !== undefined) {
//       if (patch.strike) {
//         chain.setStrike();
//       } else {
//         chain.unsetStrike();
//       }
//     }

//     if (patch.fontFamily !== undefined) {
//       if (patch.fontFamily) {
//         chain.setFontFamily(patch.fontFamily);
//       } else {
//         chain.unsetFontFamily();
//       }
//     }

//     if (patch.fontSize !== undefined) {
//       chain.setFontSize(`${patch.fontSize}px`);
//     }

//     if (patch.color !== undefined) {
//       chain.setColor(patch.color);
//     }

//     chain.run();

//     return editor.getJSON();
//   } finally {
//     editor.destroy();
//   }
// }
