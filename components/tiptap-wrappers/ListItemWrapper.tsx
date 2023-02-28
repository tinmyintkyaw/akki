import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { MdDragIndicator } from "react-icons/md";

export default function ListItemWrapper(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <div className="flex flex-row">
        <div className="h-7 w-5 flex-shrink-0 bg-red-100"></div>
        <div className="flex-shrink-0 pr-2 before:content-['▪'] [&li]:before:content-['-']"></div>
        <NodeViewContent key={crypto.randomUUID()} as={"li"} />
      </div>
    </NodeViewWrapper>
  );
}
