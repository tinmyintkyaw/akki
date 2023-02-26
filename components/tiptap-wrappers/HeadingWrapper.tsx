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
      {false && (
        <>
          <div className="prose mb-4 flex h-full flex-row justify-center">
            <div
              contentEditable={false}
              className="mr-2 flex h-full w-5 flex-shrink items-start"
            >
              <MdDragIndicator
                data-drag-handle
                // Set the height of the drag handle based on the heading level
                // so that it's always vertically centered to the first line of text
                // The height of the drag handle is 1.25 times the font size
                // 1.25 and the rem values comes from the line-height of the tailwind prose
                // https://tailwindcss.com/docs/prose#tailwindcss-typography-plugin
                // This is a bit of a hack, but it works
                className={clsx(
                  props.node.attrs.level === 1 && "h-[calc(2.25rem*1.25)] w-5",
                  props.node.attrs.level === 2 && "h-[calc(1.5rem*1.25)] w-5",
                  props.node.attrs.level === 3 && "h-[calc(1.25rem*1.25)] w-5"
                )}
              />
            </div>

            <div className="prose-sm h-full w-full max-w-full flex-grow break-words md:prose-base prose-headings:m-0 prose-headings:text-start prose-headings:font-semibold prose-headings:leading-tight">
              <NodeViewContent
                as={`h${props.node.attrs.level}` as React.ElementType}
              />
            </div>
          </div>
        </>
      )}

      <div className="">
        <NodeViewContent
          as={`h${props.node.attrs.level}` as React.ElementType}
        />
      </div>
    </NodeViewWrapper>
  );
}
