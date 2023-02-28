import BulletList from "@tiptap/extension-bullet-list";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";

import BulletListWrapper from "@/components/tiptap-wrappers/BulletListWrapper";

const CustomBulletList = BulletList.extend({
  addNodeView() {
    return ReactNodeViewRenderer(BulletListWrapper);
  },
});

export default CustomBulletList;
