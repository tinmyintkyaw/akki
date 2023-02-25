import {
  NodeViewWrapper,
  NodeViewContent,
  NodeViewRendererProps,
} from "@tiptap/react";
import { MdDragIndicator } from "react-icons/md";

export default function ParagraphWrapper(props: NodeViewRendererProps) {
  return (
    <NodeViewWrapper>
      <div className="mb-2 flex h-full w-full flex-row justify-center">
        <div
          contentEditable={false}
          className="mr-2 flex h-full w-5 flex-shrink items-start"
          // onClick={() => {
          //   props.editor.commands.setContent("<h1>Hello!</h1>");
          //   console.log(props.node.textContent);
          // }}
        >
          <MdDragIndicator
            data-drag-handle
            className="h-[calc(1rem*1.5)] w-5"
          />
        </div>

        <div className="w-xl prose-sm h-full flex-grow break-words md:prose-base prose-p:m-0 prose-p:max-w-lg prose-p:text-justify prose-p:leading-normal">
          <NodeViewContent as="p" className="flex-grow break-words" />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
