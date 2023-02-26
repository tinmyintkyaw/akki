import {
  NodeViewWrapper,
  NodeViewContent,
  NodeViewProps,
  findParentNodeClosestToPos,
} from "@tiptap/react";

import { MdDragIndicator } from "react-icons/md";

function NestedParagraphNodeView(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <div className="">
        <NodeViewContent as={"p"} />
      </div>
    </NodeViewWrapper>
  );
}

function ParagraphNodeView(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <div className="">
        <NodeViewContent as={"p"} />
      </div>
    </NodeViewWrapper>
  );
}

export default function ParagraphWrapper(props: NodeViewProps) {
  const parent = findParentNodeClosestToPos(
    props.editor.state.doc.resolve(props.getPos()!),
    (node) => node.type.name === "blockquote" || node.type.name === "listItem"
  );

  if (parent?.node) {
    return <NestedParagraphNodeView {...props} />;
  } else {
    return <ParagraphNodeView {...props} />;
  }
}
