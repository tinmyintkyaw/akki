import Paragraph from "@tiptap/extension-paragraph";
import { ReactNodeViewRenderer } from "@tiptap/react";

import BlockContainer from "@/components/tiptap-wrappers/ParagraphWrapper";

const CustomParagraph = Paragraph.extend({
  draggable: true,
  addNodeView() {
    return ReactNodeViewRenderer(BlockContainer);
  },
});

export default CustomParagraph;
