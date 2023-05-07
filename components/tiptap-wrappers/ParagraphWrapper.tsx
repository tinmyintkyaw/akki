import React from "react";
import {
  NodeViewWrapper,
  NodeViewContent,
  NodeViewProps,
  findParentNodeClosestToPos,
} from "@tiptap/react";

import { Editor } from "@tiptap/core";

import BlockWrapper from "./BlockWrapper";

function ChildParagraph(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <NodeViewContent as={"p"} className="my-1 leading-7" />
    </NodeViewWrapper>
  );
}

function RootLevelParagraph(props: NodeViewProps) {
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

  if (
    checkParentNodeNameEquals(props.editor, props.getPos(), "listItem") ||
    checkParentNodeNameEquals(props.editor, props.getPos(), "taskItem") ||
    checkParentNodeNameEquals(props.editor, props.getPos(), "blockquote")
  )
    return <ChildParagraph {...props} />;

  return <RootLevelParagraph {...props} />;
}
