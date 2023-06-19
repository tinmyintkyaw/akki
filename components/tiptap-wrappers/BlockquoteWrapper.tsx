import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import BlockWrapper from "./BlockWrapper";

export default function BlockquoteWrapper(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <BlockWrapper blockType="blockquote">
        <NodeViewContent
          as="blockquote"
          className="relative my-1 ml-4 w-full before:absolute before:top-0 before:-ml-4 before:h-full before:w-[0.125rem] before:rounded before:bg-blue-500"
        />
      </BlockWrapper>
    </NodeViewWrapper>
  );
}
