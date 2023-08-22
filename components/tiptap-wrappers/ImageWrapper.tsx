/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useRef, useState } from "react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import clsx from "clsx";
import { CircleDot } from "lucide-react";
// import {  ResizableBox } from "react-resizable";

// import "react-resizable/css/styles.css";

export default function ImageWrapper(props: NodeViewProps) {
  const [width, setWidth] = useState(700);

  const nodeViewRef = useRef<HTMLElement>(null);

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
