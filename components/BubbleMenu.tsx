import { BubbleMenu, Editor } from "@tiptap/react";
import {
  MdCode,
  MdFormatItalic,
  MdFormatBold,
  MdStrikethroughS,
} from "react-icons/md";

export default function SelectMenu(props: { editor: Editor }) {
  // TODO: Do not show this bubble menu on the title node
  return (
    <>
      {props.editor && (
        <BubbleMenu
          editor={props.editor}
          className="flex rounded border bg-white text-sm text-gray-700 shadow-lg drop-shadow-lg"
        >
          {/* TODO: Implement block convert feature */}
          <button className="flex h-8 items-center justify-center px-2 text-sm hover:bg-slate-200">
            <p>Paragraph</p>
          </button>

          <button
            onClick={() => props.editor.chain().focus().toggleBold().run()}
            className="flex h-8 w-8 items-center justify-center line-through hover:bg-slate-200"
          >
            <MdFormatBold className="h-4 w-4" />
          </button>

          <button
            onClick={() => props.editor.chain().focus().toggleItalic().run()}
            className="flex h-8 w-8 items-center justify-center line-through hover:bg-slate-200"
          >
            <MdFormatItalic className="h-4 w-4" />
          </button>

          <button
            onClick={() => props.editor.chain().focus().toggleStrike().run()}
            className="flex h-8 w-8 items-center justify-center line-through hover:bg-slate-200"
          >
            <MdStrikethroughS className="h-4 w-4" />
          </button>

          <button
            onClick={() => props.editor.chain().focus().toggleCode().run()}
            className="flex h-8 w-8 items-center justify-center line-through hover:bg-slate-200"
          >
            <MdCode className="h-4 w-4" />
          </button>
        </BubbleMenu>
      )}
    </>
  );
}
