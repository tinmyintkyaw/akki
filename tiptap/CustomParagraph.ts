import Paragraph from "@tiptap/extension-paragraph";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";

import ParagraphWrapper from "@/components/tiptap-wrappers/ParagraphWrapper";

const CustomParagraph = Paragraph.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ParagraphWrapper);
  },
});

export default CustomParagraph;
