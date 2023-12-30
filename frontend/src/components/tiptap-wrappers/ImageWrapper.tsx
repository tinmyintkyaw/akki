import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import clsx from "clsx";

export default function ImageWrapper(props: NodeViewProps) {
  return (
    <NodeViewWrapper>
      <NodeViewContent>
        <img
          src={props.node.attrs.src}
          alt={props.node.attrs.alt}
          title={props.node.attrs.title}
          className={clsx(props.selected && "opacity-80", "h-full w-full")}
        />

        {/* <ResizableBox
            axis="x"
            width={width}
            resizeHandles={["e"]}
            onResize={(event, { size }) => {
              setWidth(size.width);
            }}
            minConstraints={[200, 200]}
            maxConstraints={[
              nodeViewRef.current ? nodeViewRef.current.offsetWidth : 700,
              nodeViewRef.current ? nodeViewRef.current.offsetHeight : 700,
            ]}
            className="mx-auto"
          > */}

        {/* </ResizableBox> */}
      </NodeViewContent>
    </NodeViewWrapper>
  );
}
