import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { MdDragIndicator } from "react-icons/md";

export default function BlockquoteWrapper(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <NodeViewContent as="blockquote" />
    </NodeViewWrapper>
  );
}
