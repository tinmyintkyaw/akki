import CustomHeading from "@/tiptap/CustomHeading";
import CustomParagraph from "@/tiptap/CustomParagraph";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

import clsx from "clsx";

export default function Tiptap() {
  const content = `
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <h3>Heading 3</h3>
  <p>This is a boring paragraph.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum dapibus ante nec hendrerit. Nam in nisi maximus, auctor purus at, imperdiet metus. Nam quam sem, iaculis et sagittis vel, egestas consequat ante.</p>`;

  const editor = useEditor({
    extensions: [StarterKit, CustomHeading, CustomParagraph],
    editorProps: {
      attributes: {
        class: "w-full max-w-xl h-full p-2 outline-none",
      },
    },
    injectCSS: false,
    content: content,
    onUpdate: ({ editor }) => {
      console.log(editor.getJSON());
    },
  });

  return (
    <>
      {editor && (
        <BubbleMenu editor={editor}>
          <button onClick={() => editor?.chain().focus().toggleBold().run()}>
            Bold
          </button>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu editor={editor}>
          <button
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={clsx(
              editor.isActive("heading", { level: 1 }) && "bg-teal-500"
            )}
          >
            H1
          </button>
        </FloatingMenu>
      )}

      <EditorContent
        className="flex h-full w-full justify-center"
        editor={editor}
      />
    </>
  );
}
