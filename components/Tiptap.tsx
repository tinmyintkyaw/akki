import { useEffect, useLayoutEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import { lowlight } from "lowlight/lib/common";
import { StarterKit } from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import Heading from "@tiptap/extension-heading";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";

import CustomCodeBlock from "@/tiptap/CustomCodeBlock";
import CustomHeading from "@/tiptap/CustomHeading";
import CustomImageFrontend from "@/tiptap/CustomImageFrontend";

import SelectMenu from "@/components/BubbleMenu";

import { usePageQuery, useUpdatePageMutation } from "@/hooks/queryHooks";

import "highlight.js/styles/atom-one-light.css";

interface TiptapProps {
  pageId: string;
}

interface EditorProps {
  ydoc: Y.Doc;
  provider: HocuspocusProvider | null;
}

const Editor = (props: EditorProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");

  const session = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const pageQuery = usePageQuery(router.query.pageId as string);

  const updatePageMutation = useUpdatePageMutation(
    { id: router.query.pageId as string, pageName: newName },
    queryClient
  );

  const titleEditor = useEditor({
    extensions: [Document, Text, Heading.configure({ levels: [1] })],
    content: "",
    onUpdate({ editor }) {
      setIsEditing(true);
      setNewName(editor.getText());
    },
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  const contentEditor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        heading: false,
        codeBlock: false,
      }),
      Link,
      TaskList,
      TaskItem.configure({ nested: true }),
      CustomHeading.configure({ levels: [1, 2, 3] }),
      CustomImageFrontend.configure({ allowBase64: true }),
      CustomCodeBlock.configure({ lowlight: lowlight, defaultLanguage: "js" }),
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

  // Keep titleEditor's content in sync with query data
  useEffect(() => {
    if (pageQuery.isLoading || pageQuery.isError) return;
    if (!pageQuery.data) return;
    if (!titleEditor) return;

    titleEditor.commands.setContent(pageQuery.data.pageName);
  }, [titleEditor, pageQuery.data, pageQuery.isError, pageQuery.isLoading]);

  // Mutate remote data on title edit
  useEffect(() => {
    if (!isEditing) return;

    const timeout = setTimeout(() => {
      updatePageMutation.mutate();
      setIsEditing(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [isEditing, updatePageMutation]);

  return (
    <>
      <EditorContent
        editor={titleEditor}
        className={clsx(
          "prose mx-auto h-full w-full break-words bg-background px-8 pt-6 font-normal dark:prose-invert selection:bg-sky-200 dark:selection:bg-sky-700",
          "max-w-sm md:max-w-2xl lg:max-w-3xl" // controls the width of the editor
        )}
      />

      {contentEditor && <SelectMenu editor={contentEditor} />}

      <EditorContent
        spellCheck={false}
        className={clsx(
          "prose mx-auto h-full w-full break-words bg-background px-8 pb-6 font-normal dark:prose-invert selection:bg-sky-200 dark:selection:bg-sky-700",
          "max-w-sm md:max-w-2xl lg:max-w-3xl" // controls the width of the editor
        )}
        editor={contentEditor}
        // Prevent Tab key from escaping editor
        // onKeyDown={(event) => {
        //   if (event.key !== "Tab") return;
        //   event.preventDefault();
        // }}
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
