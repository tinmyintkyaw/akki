import { ReactNodeViewRenderer } from "@tiptap/react";

import TitleWrapper from "@/components/tiptap-wrappers/TitleWrapper";
import BackendTitle from "@/tiptap/BackendTitle";

export const FrontendTitle = BackendTitle.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TitleWrapper);
  },
});

export default FrontendTitle;
