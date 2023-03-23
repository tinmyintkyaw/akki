import { BubbleMenu, Editor } from "@tiptap/react";

export default function SelectMenu(props: { editor: Editor }) {
  return (
    <>
      {props.editor && (
        <BubbleMenu
          editor={props.editor}
          className="rounded border bg-white text-sm shadow-lg drop-shadow-lg"
        >
          {/* Placeholder for block convert feature */}
          <button
            // onClick={() => props.editor.chain().focus().toggleBold().run()}
            className="h-8 px-3 hover:bg-slate-200"
          >
            Paragraph
          </button>

          <button
            onClick={() => props.editor.chain().focus().toggleBold().run()}
            className="h-8 px-3 hover:bg-slate-200"
          >
            B
          </button>

          <button
            onClick={() => props.editor.chain().focus().toggleItalic().run()}
            className="h-8 px-3 hover:bg-slate-200"
          >
            I
          </button>

          <button
            onClick={() => props.editor.chain().focus().toggleStrike().run()}
            className="h-8 px-3 hover:bg-slate-200"
          >
            S
          </button>
          {/* <button className="h-8 px-3 hover:bg-slate-200">H3</button> */}
        </BubbleMenu>
      )}
    </>
  );
}
