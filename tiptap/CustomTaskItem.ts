import { ReactNodeViewRenderer } from "@tiptap/react";
import TaskItem from "@tiptap/extension-task-item";

import TaskItemWrapper from "@/components/tiptap-wrappers/TaskItemWrapper";

const CustomTaskItem = TaskItem.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TaskItemWrapper, { as: "li" });
  },
});

export default CustomTaskItem;
