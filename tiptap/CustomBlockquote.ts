import Blockquote from "@tiptap/extension-blockquote";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";

import BlockquoteWrapper from "@/components/tiptap-wrappers/BlockquoteWrapper";

const CustomBlockquote = Blockquote.extend({
  addNodeView() {
    return ReactNodeViewRenderer(BlockquoteWrapper);
  },
});

export default CustomBlockquote;
