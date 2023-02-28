import {
  NodeViewWrapper,
  NodeViewContent,
  NodeViewProps,
  findParentNodeClosestToPos,
} from "@tiptap/react";

import { Editor } from "@tiptap/core";

import { MdDragIndicator } from "react-icons/md";
import React from "react";

function BlockquoteParagraph(props: NodeViewProps) {
  return (
    <NodeViewWrapper className="group relative before:absolute before:top-0 before:bottom-0 before:right-full before:w-full">
      <button
        contentEditable={false}
        className="absolute -left-10 opacity-0 group-hover:opacity-100"
      >
        <MdDragIndicator className="h-7 w-5" />
      </button>

      <NodeViewContent
        as={"p"}
        className="before:content-none after:content-none"
      />
    </NodeViewWrapper>
  );
}

function ListParagraph(props: NodeViewProps) {
  return (
    <NodeViewWrapper className="group relative before:absolute before:top-0 before:bottom-0 before:right-full before:w-full">
      <button
        contentEditable={false}
        className="absolute -left-10 hidden select-none group-hover:block"
      >
        <MdDragIndicator className="h-7 w-5" />
      </button>
      <NodeViewContent as={"p"} />
    </NodeViewWrapper>
  );
}

function TaskItemParagraph(props: NodeViewProps) {
  return (
    <NodeViewWrapper className="group relative before:absolute before:top-0 before:bottom-0 before:right-full before:w-full">
      <button
        contentEditable={false}
        className="absolute -left-10 select-none opacity-0 group-hover:opacity-100"
      >
        <MdDragIndicator className="h-7 w-5" />
      </button>
      <NodeViewContent as={"p"} />
    </NodeViewWrapper>
  );
}

function RootLevelParagraph(props: NodeViewProps) {
  return (
    <NodeViewWrapper className="group relative before:absolute before:top-0 before:bottom-0 before:right-full before:w-full">
      <button
        contentEditable={false}
        className="absolute -left-5 opacity-0 group-hover:opacity-100"
      >
        <MdDragIndicator className="h-7 w-5" />
      </button>
      <NodeViewContent as={"p"} className="" />
    </NodeViewWrapper>
  );
}

export default function ParagraphWrapper(props: NodeViewProps) {
  function checkParentNodeNameEquals(
    editor: Editor,
    nodePos: number,
    parentNodeName: string
  ): boolean {
    const result = findParentNodeClosestToPos(
      editor.state.doc.resolve(nodePos),
      (node) => node.type.name === parentNodeName
    );

    if (!result) return false;
    return true;
  }

  if (checkParentNodeNameEquals(props.editor, props.getPos(), "blockquote"))
    return <BlockquoteParagraph {...props} />;

  if (checkParentNodeNameEquals(props.editor, props.getPos(), "listItem"))
    return <ListParagraph {...props} />;

  if (checkParentNodeNameEquals(props.editor, props.getPos(), "taskItem"))
    return <TaskItemParagraph {...props} />;

  return <RootLevelParagraph {...props} />;
}
