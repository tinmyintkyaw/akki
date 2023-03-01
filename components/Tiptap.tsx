import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";

import clsx from "clsx";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import { StarterKit } from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import TaskList from "@tiptap/extension-task-list";

import CustomHeading from "@/tiptap/CustomHeading";
import CustomParagraph from "@/tiptap/CustomParagraph";
import CustomBlockquote from "@/tiptap/CustomBlockquote";
import CustomTaskItem from "@/tiptap/CustomTaskItem";
import SelectMenu from "./BubbleMenu";

export default function Tiptap() {
  const content = `
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <h3>Heading 3</h3>
  <blockquote><p>This is a boring paragraph.</p></blockquote>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum dapibus ante nec hendrerit. Nam in nisi maximus, auctor purus at, imperdiet metus. Nam quam sem, iaculis et sagittis vel, egestas consequat ante.</p>`;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Text,
      CustomHeading,
      CustomParagraph,
      CustomBlockquote,
      // TODO: Finish TaskItem toggle logic
      // TaskList,
      // CustomTaskItem.configure({ nested: true }),
    ],
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
    injectCSS: false,
    content: content,
    autofocus: true,
    onUpdate: ({ editor }) => {
      console.log(editor.getJSON());
      console.log(editor.getHTML());
    },
    // onTransaction: ({ editor, transaction }) => {
    //   console.log(editor.state.selection.$anchor.parent);
    // },
  });

  return (
    <>
      {editor && <SelectMenu editor={editor} />}

      {/* {editor && (
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
      )} */}

      <EditorContent
        className={clsx(
          "prose mx-auto w-full break-words p-4 text-black",
          "max-w-2xl", // controls the width of the editor
          "prose-base", // controls the overall editor font size
          "prose-headings:mb-2 prose-headings:w-full prose-headings:font-semibold prose-h1:mt-8 prose-h2:mt-6 prose-h3:mt-4",
          "prose-p:mb-4 prose-p:mt-0 prose-p:w-full",
          "prose-ul:my-1 prose-ul:w-full prose-ul:list-disc prose-ul:pl-5",
          "prose-ol:mt-1 prose-ol:mb-0 prose-ol:w-full prose-ol:list-decimal prose-ol:pl-5",
          "prose-li:my-0 prose-li:w-full prose-li:px-0"
        )}
        editor={editor}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          event.preventDefault();
        }}
      />
    </>
  );
}
