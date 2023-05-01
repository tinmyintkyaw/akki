import {
  NodeViewWrapper,
  NodeViewContent,
  NodeViewRendererProps,
} from "@tiptap/react";
import clsx from "clsx";
import { MdDragIndicator } from "react-icons/md";

export default function HeadingWrapper(props: NodeViewRendererProps) {
  return (
    <>
      <NodeViewWrapper
        className={clsx(
          "group relative before:absolute before:bottom-0 before:right-full before:top-0 before:w-full",
          "mb-4 mt-6 font-semibold",
          props.node.attrs.level === 1 && "text-3xl",
          props.node.attrs.level === 2 && "text-2xl",
          props.node.attrs.level === 3 && "text-xl"
        )}
      >
        <button
          contentEditable={false}
          className="absolute -left-5 opacity-0 group-hover:opacity-100"
        >
          <MdDragIndicator
            className={clsx(
              props.node.attrs.level === 1 && "h-9 w-5",
              props.node.attrs.level === 2 && "h-8 w-5",
              props.node.attrs.level === 3 && "h-7 w-5"
            )}
          />
        </button>

        <NodeViewContent
          as={`h${props.node.attrs.level}` as React.ElementType}
        />
      </NodeViewWrapper>
    </>
  );
}
