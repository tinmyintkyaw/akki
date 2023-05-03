import { useEffect, useMemo } from "react";
import { useEditor, EditorContent, generateText } from "@tiptap/react";

import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

import clsx from "clsx";
import { useSession, getSession } from "next-auth/react";
import { StarterKit } from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import TaskList from "@tiptap/extension-task-list";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CustomParagraph from "@/tiptap/CustomParagraph";
import CustomBlockquote from "@/tiptap/CustomBlockquote";
import CustomTaskItem from "@/tiptap/CustomTaskItem";
import CustomListItem from "@/tiptap/CustomListItem";
import CustomImage from "@/tiptap/CustomImage";
import CustomHeadingFrondend from "@/tiptap/CustomHeadingFrontend";
import SelectMenu from "@/components/BubbleMenu";
import TitleEditor from "@/components/TitleEditor";

type TiptapProps = {
  pageId: string;
};

export default function Tiptap(props: TiptapProps) {
  const session = useSession();

  let ydoc = useMemo(() => new Y.Doc(), []);

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
      StarterKit.configure({
        history: false,
        heading: false,
        paragraph: false,
        listItem: false,
        blockquote: false,
      }),
      Link,
      TaskList,
      CustomHeadingFrondend.configure({ levels: [1, 2, 3] }),
      CustomParagraph,
      CustomBlockquote,
      CustomImage.configure({ allowBase64: true }),
      Placeholder.configure({
        placeholder: "Start typing...",
      }),
      CustomListItem,
      CustomTaskItem.configure({ nested: true }),
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

  useEffect(() => {
    editor?.setEditable(false);
    provider.connect().then(() => editor?.setEditable(true));

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
        spellCheck={false}
        className={clsx(
          "mx-auto h-full w-full break-words px-8 py-4 font-normal text-gray-900 selection:bg-sky-200",
          "max-w-3xl" // controls the width of the editor
        )}
        editor={editor}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          event.preventDefault();
        }}
      >
        <TitleEditor />
      </EditorContent>
    </>
  );
}
