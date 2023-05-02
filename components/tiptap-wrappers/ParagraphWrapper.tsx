import {
  NodeViewWrapper,
  NodeViewContent,
  NodeViewProps,
  findParentNodeClosestToPos,
} from "@tiptap/react";

import { Editor } from "@tiptap/core";

import { MdDragIndicator } from "react-icons/md";
import React, { useState } from "react";
import BlockWrapper from "./BlockWrapper";

function BlockquoteParagraph(props: NodeViewProps) {
  return (
    <NodeViewWrapper className="not-prose group relative before:absolute before:bottom-0 before:right-full before:top-0 before:w-full">
      <button
        contentEditable={false}
        className="absolute -left-10 opacity-0 group-hover:opacity-100"
      >
        <MdDragIndicator className="h-7 w-5" />
      </button>

      <NodeViewContent
        as={"p"}
        className="not-prose before:content-none after:content-none"
      />
    </NodeViewWrapper>
  );
}

function ListItemParagraph(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <NodeViewContent as={"p"} className="my-1 leading-7" />
    </NodeViewWrapper>
  );
}

function RootLevelParagraph(props: NodeViewProps) {
  const [showhandle, setShowHandle] = useState(false);

  return (
    <NodeViewWrapper>
      <BlockWrapper>
        <NodeViewContent as={"p"} className="my-1 w-full leading-7" />
      </BlockWrapper>
    </NodeViewWrapper>
  );
}

export default function ParagraphWrapper(props: NodeViewProps) {
  function checkParentNodeNameEquals(
    editor: Editor,
    nodePos: number,
    parentNodeName: string
  ): boolean {
    const result = findParentNodeClosestToPos(
      editor.state.doc.resolve(nodePos),
      (node) => node.type.name === parentNodeName
    );

    if (!result) return false;
    return true;
  }

  if (checkParentNodeNameEquals(props.editor, props.getPos(), "blockquote"))
    return <BlockquoteParagraph {...props} />;

  if (
    checkParentNodeNameEquals(props.editor, props.getPos(), "listItem") ||
    checkParentNodeNameEquals(props.editor, props.getPos(), "taskItem")
  )
    return <ListItemParagraph {...props} />;

  return <RootLevelParagraph {...props} />;
}
