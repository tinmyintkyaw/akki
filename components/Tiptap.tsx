import { useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { HocuspocusProvider } from "@hocuspocus/provider";

import clsx from "clsx";
import { useSession } from "next-auth/react";
import { StarterKit } from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import TaskList from "@tiptap/extension-task-list";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

import CustomHeading from "@/tiptap/CustomHeading";
import CustomParagraph from "@/tiptap/CustomParagraph";
import CustomBlockquote from "@/tiptap/CustomBlockquote";
import CustomTaskItem from "@/tiptap/CustomTaskItem";

import SelectMenu from "./BubbleMenu";

export default function Tiptap() {
  const ydoc = useMemo(() => new Y.Doc(), []);

  const persistence = useMemo(
    () => new IndexeddbPersistence("test", ydoc),
    [ydoc]
  );

  const session = useSession();
  useEffect(() => {
    console.log(session);

    // fetch("api/socket")
    //   .then((res) => res.json())
    //   .then((data) => setSocketToken(data.socketToken));
  }, []);

  const provider = useMemo(
    () =>
      new HocuspocusProvider({
        url: "ws://localhost:8080/collaboration/",
        name: "test",
        document: ydoc,
        token: "test",
      }),
    [ydoc]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      CustomHeading,
      CustomParagraph,
      CustomBlockquote,
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({
        provider,
        // user: { name: crypto.randomUUID() },
      }),
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
    autofocus: true,
  });

  return (
    <>
      {editor && <SelectMenu editor={editor} />}

      <EditorContent
        className={clsx(
          "prose prose-slate mx-auto h-full w-full break-words py-4 px-8 text-black",
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
