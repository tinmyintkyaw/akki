import Blockquote from "@tiptap/extension-blockquote";
import { ReactNodeViewRenderer } from "@tiptap/react";

import BlockquoteWrapper from "@/components/tiptap-wrappers/BlockquoteWrapper";

const CustomBlockquote = Blockquote.extend({
  draggable: true,
  content: "paragraph*",
  addNodeView() {
    return ReactNodeViewRenderer(BlockquoteWrapper);
  },
});

export default CustomBlockquote;
