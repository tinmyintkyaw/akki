import React from "react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";

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
  const parentNode = props.editor.view.state.doc.resolve(props.getPos()).parent;

  if (
    (parentNode.type.name === "listItem" &&
      parentNode.firstChild &&
      props.node.eq(parentNode.firstChild)) ||
    (parentNode.type.name === "taskItem" &&
      parentNode.firstChild &&
      props.node.eq(parentNode.firstChild)) ||
    parentNode.type.name === "blockquote"
  )
    return <ChildParagraph {...props} />;

  return <RootLevelParagraph {...props} />;
}
