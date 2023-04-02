import { ReactNodeViewRenderer } from "@tiptap/react";

import HeadingWrapper from "@/components/tiptap-wrappers/HeadingWrapper";
import CustomHeadingBackend from "@/tiptap/CustomHeadingBackend";

const CustomHeadingFrondend = CustomHeadingBackend.extend({
  marks: "",
  addNodeView() {
    return ReactNodeViewRenderer(HeadingWrapper);
  },
});

export default CustomHeadingFrondend;
