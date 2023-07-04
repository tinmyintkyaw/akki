import { useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

import clsx from "clsx";
import { useSession } from "next-auth/react";
import { lowlight } from "lowlight/lib/common";
import { StarterKit } from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import CustomCodeBlock from "@/tiptap/CustomCodeBlock";
import CustomDocument from "@/tiptap/CustomDocument";
import CustomHeading from "@/tiptap/CustomHeading";
import CustomImageFrontend from "@/tiptap/CustomImageFrontend";
import FrontendTitle from "@/tiptap/FrontendTitle";

import SelectMenu from "@/components/BubbleMenu";

import "highlight.js/styles/atom-one-light.css";
import TaskItem from "@tiptap/extension-task-item";

type TiptapProps = {
  pageId: string;
};

export default function Tiptap(props: TiptapProps) {
  const session = useSession();

  let ydoc = useMemo(() => new Y.Doc(), []);

  const provider = useMemo(() => {
    return new HocuspocusProvider({
      url: `ws://localhost:8080/collaboration/${props.pageId}`,
      name: props.pageId,
      document: ydoc,
      token: "test", // Not using token auth, but onAuthenticate hook on server won't fire with a empty string
    });
  }, [props.pageId, ydoc]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: false,
        history: false,
        heading: false,
        codeBlock: false,
      }),
      CustomDocument,
      FrontendTitle,
      Link,
      TaskList,
      TaskItem.configure({ nested: true }),
      CustomHeading.configure({ levels: [1, 2, 3] }),
      CustomImageFrontend.configure({ allowBase64: true }),
      CustomCodeBlock.configure({ lowlight: lowlight, defaultLanguage: "js" }),
      Placeholder.configure({
        placeholder({ editor, node }) {
          return "Start typing...";
        },
      }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: session.data?.user?.name,
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  return (
    <>
      {editor && <SelectMenu editor={editor} />}

      <EditorContent
        spellCheck={false}
        className={clsx(
          "prose mx-auto h-full w-full break-words px-8 py-4 font-normal text-gray-900 selection:bg-sky-200",
          "max-w-3xl" // controls the width of the editor
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
