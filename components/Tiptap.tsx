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
  <test><h1>Heading</h1></test>
  <test><p>This is a boring paragraph.</p></test>
  <test><p>Let’s finish with a boring paragraph.</p></test>`;

  const editor = useEditor({
    extensions: [StarterKit, Document, Text, CustomHeading, CustomParagraph],
    editorProps: {
      attributes: {
        // TODO: Implement customizations to the tailwind prose in the tailwind config file
        class:
          "w-full h-full max-w-2xl p-2 outline-none prose prose-headings:font-medium prose-h1:text-xl prose-h2:text-lg prose-h3:text-base",
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
        className="w-full h-full flex justify-center"
        editor={editor}
      />
    </>
  );
}
