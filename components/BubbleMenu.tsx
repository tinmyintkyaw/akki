import { BubbleMenu, Editor } from "@tiptap/react";

export default function SelectMenu(props: { editor: Editor }) {
  return (
    <>
      {props.editor && (
        <BubbleMenu
          editor={props.editor}
          className="rounded border bg-white drop-shadow-lg"
        >
          <button
            onClick={() => props.editor.chain().focus().toggleBold().run()}
            className="h-8 w-8 px-2 hover:bg-slate-200"
          >
            B
          </button>

          <button
            onClick={() => props.editor.chain().focus().toggleItalic().run()}
            className="h-8 w-8 px-2 hover:bg-slate-200"
          >
            I
          </button>

          <button
            onClick={() => props.editor.chain().focus().toggleStrike().run()}
            className="h-8 w-8 px-2 hover:bg-slate-200"
          >
            S
          </button>
          {/* <button className="h-8 w-8 px-2 hover:bg-slate-200">H3</button> */}
        </BubbleMenu>
      )}
    </>
  );
}
