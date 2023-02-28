import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { MdDragIndicator } from "react-icons/md";

export default function TaskItemWrapper(props: NodeViewProps) {
  return (
    <NodeViewWrapper as={"li"} className="relative">
      <label contentEditable={false}>
        <input type={"checkbox"} className="absolute -left-5 h-7 w-4" />
      </label>
      <NodeViewContent as={"div"} />
    </NodeViewWrapper>
  );
}
