import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import BlockWrapper from "./BlockWrapper";

export default function ListItemWrapper(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <BlockWrapper>
        <div className="h-7 w-5 select-none" />

        <NodeViewContent as={"li"} className="w-full" />
      </BlockWrapper>
    </NodeViewWrapper>
  );
}
