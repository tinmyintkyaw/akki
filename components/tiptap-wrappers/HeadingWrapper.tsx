import {
  NodeViewWrapper,
  NodeViewContent,
  NodeViewRendererProps,
} from "@tiptap/react";
import clsx from "clsx";
import { MdDragIndicator } from "react-icons/md";
import BlockWrapper from "./BlockWrapper";

export default function HeadingWrapper(props: NodeViewRendererProps) {
  const blockType =
    props.node.attrs.level === 1
      ? "h1"
      : props.node.attrs.level === 2
      ? "h2"
      : "h3";

  return (
    <>
      <NodeViewWrapper>
        <BlockWrapper blockType={blockType}>
          <NodeViewContent
            as={
              props.node.attrs.level === 1
                ? "h1"
                : props.node.attrs.level === 2
                ? "h2"
                : "h3"
            }
            className={clsx(
              "w-full font-semibold",
              props.node.attrs.level === 1 && "text-3xl",
              props.node.attrs.level === 2 && "text-2xl",
              props.node.attrs.level === 3 && "text-xl"
            )}
          />
        </BlockWrapper>
      </NodeViewWrapper>
    </>
  );
}
