import BulletList from "@tiptap/extension-bullet-list";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";

import BulletListWrapper from "@/components/tiptap-wrappers/BulletListWrapper";

const CustomBulletList = BulletList.extend({
  draggable: true,
  priority: 2000,
  // content: "list_item",
  // renderHTML({ HTMLAttributes, node }) {
  //   return [
  //     "li",
  //     mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
  //     0,
  //   ];
  // },
  addNodeView() {
    return ReactNodeViewRenderer(BulletListWrapper);
  },
});

export default CustomBulletList;
