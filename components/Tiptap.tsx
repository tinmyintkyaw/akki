import { useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { HocuspocusProvider } from "@hocuspocus/provider";

import clsx from "clsx";
import { useSession, getSession } from "next-auth/react";
import { StarterKit } from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import TaskList from "@tiptap/extension-task-list";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

import CustomDocument from "@/tiptap/CustomDocument";
import CustomHeading from "@/tiptap/CustomHeading";
import CustomParagraph from "@/tiptap/CustomParagraph";
import CustomBlockquote from "@/tiptap/CustomBlockquote";
import CustomTaskItem from "@/tiptap/CustomTaskItem";

import SelectMenu from "./BubbleMenu";

import Text from "@tiptap/extension-text";
import { Title } from "@/tiptap/Title";
import Placeholder from "@tiptap/extension-placeholder";
import CustomListItem from "@/tiptap/CustomListItem";
import TaskItem from "@tiptap/extension-task-item";

type TiptapProps = {
  pageId: string;
};

export default function Tiptap(props: TiptapProps) {
  const session = useSession();

  let ydoc = useMemo(() => new Y.Doc(), []);

  // const persistence = useMemo(
  //   () => new IndexeddbPersistence("test", ydoc),
  //   [ydoc]
  // );

  const provider = useMemo(() => {
    return new HocuspocusProvider({
      url: "ws://localhost:8080/collaboration/",
      name: props.pageId,
      document: ydoc,
      token: "test", // Not using token auth, but onAuthenticate hook on server won't fire with a empty string
      connect: false,
    });
  }, [props.pageId, ydoc]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false, heading: { levels: [1, 2, 3] } }),
      Text,
      CustomDocument,
      Title,
      // CustomHeading.configure({ levels: [1, 2, 3] }),
      // CustomParagraph,
      // CustomBlockquote,
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: session.data?.user?.name,
        },
      }),
      Placeholder.configure({
        placeholder(PlaceholderProps) {
          if (PlaceholderProps.node.type.name === "title") {
            return "Untitled";
          }
          return "placeholder";
        },
      }),
      // TODO: Finish TaskItem toggle logic
      // CustomTaskItem.configure({ nested: true }),
    ],
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  useEffect(() => {
    provider.connect();

    // On unmount, sync and disconnect
    return () => {
      !provider.hasUnsyncedChanges && provider.forceSync();
      provider.disconnect();
      provider.destroy();
    };
  }, [provider, editor]);

  return (
    <>
      {editor && <SelectMenu editor={editor} />}

      <EditorContent
        className={clsx(
          "prose prose-slate mx-auto h-full w-full break-words py-4 px-8 text-stone-900",
          "max-w-3xl", // controls the width of the editor
          "prose-base", // controls the overall editor font size
          "prose-headings:mb-4 prose-headings:w-full prose-headings:font-semibold prose-h1:mt-8 prose-h1:text-3xl prose-h2:mt-6 prose-h3:mt-4",
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
