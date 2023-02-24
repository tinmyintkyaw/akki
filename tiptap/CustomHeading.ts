import Heading from "@tiptap/extension-heading";
import { ReactNodeViewRenderer } from "@tiptap/react";

import BlockContainer from "@/components/tiptap-wrappers/HeadingWrapper";

const CustomHeading = Heading.extend({
  draggable: true,
  addNodeView() {
    return ReactNodeViewRenderer(BlockContainer);
  },
});

export default CustomHeading;
