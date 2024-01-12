import { useSession } from "@/hooks/useSession";
import CustomCodeBlock from "@/tiptap/CustomCodeBlock";
import CustomDocument from "@/tiptap/CustomDocument";
import CustomHeading from "@/tiptap/CustomHeading";
import CustomImageFrontend from "@/tiptap/CustomImageFrontend";
import useStore from "@/zustand/store";
import { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

const useContentEditor = (provider: HocuspocusProvider) => {
  const { session } = useSession();

  const editorCursor = useStore((state) => state.editorSelection);
  const isCmdPaletteOpen = useStore((state) => state.isCmdPaletteOpen);
  const setEditorCursor = useStore((state) => state.setEditorSelection);

  return useEditor({
    extensions: [
      StarterKit.configure({
        document: false,
        history: false,
        heading: false,
        codeBlock: false,
      }),
      CustomDocument,
      Link.configure({
        openOnClick: false,
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CustomHeading.configure({ levels: [1, 2, 3] }),
      CustomImageFrontend,
      CustomCodeBlock.configure({
        lowlight: lowlight,
        defaultLanguage: "js",
      }),
      Placeholder.configure({
        includeChildren: true,
        placeholder({ node }) {
          if (node.type.name === "codeBlock") return "";
          if (node.type.name === "heading") {
            if (node.attrs.level === 1) return "Heading 1";
            if (node.attrs.level === 2) return "Heading 2";
            if (node.attrs.level === 3) return "Heading 3";
          }
          return "Start writing...";
        },
      }),
      Collaboration.configure({
        document: provider.document,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: session?.user.name,
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },

    onUpdate({ editor }) {
      if (isCmdPaletteOpen || !editorCursor || !editorCursor.pageChanged)
        return;

      const { start, end } = editorCursor;

      const canFocus = editor.can().focus(editorCursor.start);
      const canSelect = editor.can().setTextSelection({ from: start, to: end });

      if (canFocus && canSelect) {
        editor
          .chain()
          .focus(editorCursor.start, { scrollIntoView: true })
          .setTextSelection({ from: start, to: end })
          .run();

        setEditorCursor(null);
      }
    },
  });
};
export default useContentEditor;
