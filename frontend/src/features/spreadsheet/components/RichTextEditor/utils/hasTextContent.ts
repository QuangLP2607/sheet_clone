import type { JSONContent } from "@tiptap/core";

export function hasTextContent(content: JSONContent): boolean {
  if (typeof content.text === "string" && content.text.length > 0) {
    return true;
  }

  if (!content.content) {
    return false;
  }

  return content.content.some(hasTextContent);
}
