import Heading from "@tiptap/extension-heading";
import { ReactNodeViewRenderer } from "@tiptap/react";

import HeadingWrapper from "@/components/tiptap-wrappers/HeadingWrapper";

const CustomHeading = Heading.extend({
  addNodeView() {
    return ReactNodeViewRenderer(HeadingWrapper);
  },
});

export default CustomHeading;
