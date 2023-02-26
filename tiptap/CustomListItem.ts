import ListItem from "@tiptap/extension-list-item";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";

import ListItemWrapper from "@/components/tiptap-wrappers/ListItemWrapper";

const CustomListItem = ListItem.extend({
  draggable: true,
  priority: 2000,
  content: "block+",
  renderHTML({ HTMLAttributes, node }) {
    return [
      "li",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ListItemWrapper);
  },
});

export default CustomListItem;
