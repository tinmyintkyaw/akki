import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { useState } from "react";
import { MdDragIndicator } from "react-icons/md";
import BlockWrapper from "./BlockWrapper";

export default function TaskItemWrapper(props: NodeViewProps) {
  const [showhandle, setShowHandle] = useState(false);

  return (
    <NodeViewWrapper>
      <BlockWrapper>
        <label contentEditable={false} className="mr-2 select-none">
          <input type={"checkbox"} className="my-1 h-7 w-4" />
        </label>

        <NodeViewContent as={"div"} className="w-full" />
      </BlockWrapper>
    </NodeViewWrapper>
  );
}
