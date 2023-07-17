import { useEffect, useLayoutEffect, useState } from "react";
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
import TaskItem from "@tiptap/extension-task-item";

import CustomCodeBlock from "@/tiptap/CustomCodeBlock";
import CustomDocument from "@/tiptap/CustomDocument";
import CustomHeading from "@/tiptap/CustomHeading";
import CustomImageFrontend from "@/tiptap/CustomImageFrontend";
import FrontendTitle from "@/tiptap/FrontendTitle";

import SelectMenu from "@/components/BubbleMenu";

import "highlight.js/styles/atom-one-light.css";

interface TiptapProps {
  pageId: string;
}

interface EditorProps {
  ydoc: Y.Doc;
  provider: HocuspocusProvider | null;
}

const Editor = (props: EditorProps) => {
  const session = useSession();
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
        placeholder({ node }) {
          if (node.type.name !== "codeBloack") return "Start typing...";
          return "";
        },
      }),
      Collaboration.configure({ document: props.ydoc }),
      CollaborationCursor.configure({
        provider: props.provider,
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
          "prose mx-auto h-full w-full break-words bg-background px-8 py-4 font-normal dark:prose-invert selection:bg-sky-200 dark:selection:bg-sky-700",
          "max-w-sm md:max-w-2xl lg:max-w-3xl" // controls the width of the editor
        )}
        editor={editor}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          event.preventDefault();
        }}
      />
    </>
  );
};

const Tiptap = (props: TiptapProps) => {
  const [ydoc, setYdoc] = useState<Y.Doc>(new Y.Doc());
  const [webSocketProvider, setWebSocketProvider] =
    useState<HocuspocusProvider | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Prevent React Strict Mode from opening multiple connections
  useLayoutEffect(() => {
    const provider = new HocuspocusProvider({
      url: `ws://localhost:8080/collaboration/${props.pageId}`,
      name: props.pageId,
      document: ydoc,
      token: async () => {
        const response = await fetch("/api/collab/token");
        if (!response.ok) return "";
        const { collabToken } = await response.json();
        return collabToken as string;
      },
    });

    setWebSocketProvider(provider);

    return () => {
      provider.destroy();
      setWebSocketProvider(null);
    };
  }, [ydoc, props.pageId]);

  useEffect(() => {
    if (!webSocketProvider) return;
    setShowEditor(true);
  }, [webSocketProvider]);

  return (
    <>{showEditor && <Editor ydoc={ydoc} provider={webSocketProvider} />}</>
  );
};

export default Tiptap;
