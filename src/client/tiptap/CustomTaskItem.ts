import TaskItemWrapper from "@/components/tiptap-wrappers/TaskItemWrapper";
import TaskItem from "@tiptap/extension-task-item";
import { ReactNodeViewRenderer } from "@tiptap/react";

const CustomTaskItem = TaskItem.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TaskItemWrapper, { as: "li" });
  },
});

export default CustomTaskItem;
