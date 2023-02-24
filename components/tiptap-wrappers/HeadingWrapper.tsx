import {
  NodeViewWrapper,
  NodeViewContent,
  NodeViewRendererProps,
} from "@tiptap/react";
import clsx from "clsx";
import { MdDragIndicator } from "react-icons/md";

export default function HeadingWrapper(props: NodeViewRendererProps) {
  return (
    <NodeViewWrapper>
      <div className="w-full h-full flex justify-center p-4 border flex-row">
        <div
          data-drag-handle
          contentEditable={false}
          className={clsx(
            // props.node.attrs.level === 1 && "h-10",
            // props.node.attrs.level === 2 && "h-8",
            "w-5 h-7 flex items-start flex-shrink mr-2"
          )}
        >
          <MdDragIndicator className="w-5 h-7" />
        </div>

        <NodeViewContent
          as={`h${props.node.attrs.level}` as React.ElementType}
          className="flex-grow my-0"
        />
      </div>
    </NodeViewWrapper>
  );
}
