import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";

import BlockWrapper from "./BlockWrapper";

export default function CodeBlockWrapper(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <BlockWrapper>
        <NodeViewContent
          as="pre"
          className="my-1 w-full rounded bg-slate-200 px-2 py-2"
        />
      </BlockWrapper>
    </NodeViewWrapper>
  );
}
