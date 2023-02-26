import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { MdDragIndicator } from "react-icons/md";

export default function ListItemWrapper(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <div className="bg-slate-300">
        <NodeViewContent as="ul" />
      </div>
    </NodeViewWrapper>
  );
}
