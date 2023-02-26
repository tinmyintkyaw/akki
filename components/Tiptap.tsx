import CustomHeading from "@/tiptap/CustomHeading";
import CustomParagraph from "@/tiptap/CustomParagraph";
import CustomBlockquote from "@/tiptap/CustomBlockquote";
import CustomListItem from "@/tiptap/CustomListItem";
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
  <blockquote><p>This is a boring paragraph.</p></blockquote>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum dapibus ante nec hendrerit. Nam in nisi maximus, auctor purus at, imperdiet metus. Nam quam sem, iaculis et sagittis vel, egestas consequat ante.</p>`;

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      // StarterKit,
      CustomHeading,
      CustomParagraph,
      CustomBlockquote,
      // BulletList,
      // CustomListItem,
    ],
    editorProps: {
      attributes: {
        class: "w-full h-full outline-none",
      },
    },
    injectCSS: false,
    content: content,
    onUpdate: ({ editor }) => {
      console.log(editor.getJSON());
    },
    // onTransaction: ({ editor, transaction }) => {
    //   console.log(editor.state.selection.$anchor.parent);
    // },
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

      {editor && false && (
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

      <div id="editor-container" className="flex h-full w-full justify-center">
        <EditorContent
          className={clsx(
            "prose w-full break-words",
            "max-w-xl", // controls the width of the editor
            "prose-base", // controls the overall editor font size
            "prose-headings:mb-1 prose-headings:font-semibold prose-h1:mt-8 prose-h2:mt-6 prose-h3:mt-4",
            "prose-p:mt-2 prose-p:mb-1 prose-p:text-justify"
          )}
          editor={editor}
        />
      </div>
    </>
  );
}
