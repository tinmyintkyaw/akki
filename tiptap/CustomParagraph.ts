import Paragraph from "@tiptap/extension-paragraph";
import { ReactNodeViewRenderer } from "@tiptap/react";

import ParagraphWrapper from "@/components/tiptap-wrappers/ParagraphWrapper";

const CustomParagraph = Paragraph.extend({
  draggable: true,
  addNodeView() {
    return ReactNodeViewRenderer(ParagraphWrapper);
  },
});

export default CustomParagraph;
