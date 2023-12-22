import CodeBlockWrapper from "@/components/tiptap-wrappers/CodeBlockWrapper";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";

const CustomCodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockWrapper);
  },
});

export default CustomCodeBlock;
