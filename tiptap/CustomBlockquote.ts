import Blockquote from "@tiptap/extension-blockquote";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";

import BlockquoteWrapper from "@/components/tiptap-wrappers/BlockquoteWrapper";

const CustomBlockquote = Blockquote.extend({
  priority: 1000,
  content: "paragraph*",
  addNodeView() {
    return ReactNodeViewRenderer(BlockquoteWrapper);
  },
});

export default CustomBlockquote;
