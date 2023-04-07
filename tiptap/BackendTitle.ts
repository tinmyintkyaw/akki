import { Node } from "@tiptap/core";

export const BackendTitle = Node.create({
  name: "title",
  content: "inline*",
  group: "block",
  marks: "",
  defining: true,
  renderHTML(props) {
    return ["h1"];
  },
});

export default BackendTitle;
