import ListItem from "@tiptap/extension-list-item";
import { mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";

import ListItemWrapper from "@/components/tiptap-wrappers/ListItemWrapper";

const CustomListItem = ListItem.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ListItemWrapper);
  },
});

export default CustomListItem;
