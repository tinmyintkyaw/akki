import {
  NodeViewWrapper,
  NodeViewContent,
  NodeViewRendererProps,
} from "@tiptap/react";
import clsx from "clsx";
import { MdDragIndicator } from "react-icons/md";

export default function ParagraphWrapper(props: NodeViewRendererProps) {
  return (
    <NodeViewWrapper>
      <div className="w-full h-full flex justify-center p-4 border flex-row">
        <div
          data-drag-handle
          contentEditable={false}
          className={clsx("flex items-center")}
          // onClick={() => {
          //   props.editor.commands.setContent("<h1>Hello!</h1>");
          //   console.log(props.node.textContent);
          // }}
        >
          <MdDragIndicator className="w-5 h-7 flex-shrink mr-2" />
        </div>

        <NodeViewContent as="p" className="flex-grow my-0 text-justify" />
      </div>
    </NodeViewWrapper>
  );
}
