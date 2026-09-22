import { Fragment, type CSSProperties, type ReactNode } from "react";

import type { JSONContent } from "@tiptap/core";

interface CellValueProps {
  content: JSONContent;
}

function getMarkStyle(
  type: string,
  attrs?: Record<string, unknown>,
): CSSProperties {
  switch (type) {
    case "bold":
      return {
        fontWeight: "bold",
      };

    case "italic":
      return {
        fontStyle: "italic",
      };

    case "strike":
      return {
        textDecoration: "line-through",
      };

    case "textStyle":
      return {
        ...(typeof attrs?.color === "string"
          ? {
              color: attrs.color,
            }
          : {}),

        ...(typeof attrs?.fontSize === "string"
          ? {
              fontSize: attrs.fontSize,
            }
          : typeof attrs?.fontSize === "number"
            ? {
                fontSize: `${attrs.fontSize}px`,
              }
            : {}),

        ...(typeof attrs?.fontFamily === "string"
          ? {
              fontFamily: attrs.fontFamily,
            }
          : {}),
      };

    default:
      return {};
  }
}

function renderNode(node: JSONContent): ReactNode {
  if (node.type === "text") {
    let style: CSSProperties | undefined;

    for (const mark of node.marks ?? []) {
      style = {
        ...style,
        ...getMarkStyle(mark.type, mark.attrs),
      };
    }

    return <span style={style}>{node.text ?? ""}</span>;
  }

  if (node.type === "paragraph") {
    return (
      <div>
        {node.content?.map((child, index) => (
          <Fragment key={index}>{renderNode(child)}</Fragment>
        ))}
      </div>
    );
  }

  return null;
}

export default function CellValue({ content }: CellValueProps) {
  return (
    <>
      {content.content?.map((node, index) => (
        <Fragment key={index}>{renderNode(node)}</Fragment>
      ))}
    </>
  );
}
