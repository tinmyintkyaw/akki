/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useRef, useState } from "react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
// import {  ResizableBox } from "react-resizable";

// import "react-resizable/css/styles.css";

export default function ImageWrapper(props: NodeViewProps) {
  const [width, setWidth] = useState(700);

  const nodeViewRef = useRef<HTMLElement>(null);

  useEffect(() => console.log(props), [props]);

  return (
    <NodeViewWrapper ref={nodeViewRef}>
      <NodeViewContent>
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
        <img
          src={props.node.attrs.src}
          alt={props.node.attrs.alt}
          title={props.node.attrs.title}
        />
        {/* </ResizableBox> */}
      </NodeViewContent>
    </NodeViewWrapper>
  );
}
