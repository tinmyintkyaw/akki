import CodeBlockWrapper from "@/components/tiptap-wrappers/CodeBlockWrapper";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { lowlight } from "lowlight";
import py from "highlight.js/lib/languages/python";

lowlight.registerLanguage("py", py);

const CustomCodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockWrapper);
  },
});

export default CustomCodeBlock;
