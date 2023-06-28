import { BubbleMenu, Editor, isTextSelection } from "@tiptap/react";
import {
  MdCode,
  MdFormatItalic,
  MdFormatBold,
  MdStrikethroughS,
} from "react-icons/md";

export default function SelectMenu(props: { editor: Editor }) {
  return (
    <>
      {props.editor && (
        <BubbleMenu
          editor={props.editor}
          shouldShow={({ editor, state, from, to }) => {
            const { doc, selection } = state;
            const { empty } = selection;

            const isEmptyTextBlock =
              !doc.textBetween(from, to).length &&
              isTextSelection(state.selection);

            if (
              empty ||
              isEmptyTextBlock ||
              !editor.isEditable ||
              editor.isActive("title")
            ) {
              return false;
            }
            return true;
          }}
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
