import { mergeAttributes, Node, textblockTypeInputRule } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import TitleWrapper from "@/components/tiptap-wrappers/TitleWrapper";

export const Title = Node.create({
  name: "title",
  content: "inline*",
  group: "block",
  marks: "",
  defining: true,
  renderHTML(props) {
    return ["h1"];
  },
  addNodeView() {
    return ReactNodeViewRenderer(TitleWrapper);
  },
});
