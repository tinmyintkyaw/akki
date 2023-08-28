import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";

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
import CustomDocument from "@/tiptap/CustomDocument";

import SelectMenu from "@/components/editor/BubbleMenu";

import { usePageQuery, useUpdatePageMutation } from "@/hooks/pageQueryHooks";

import "highlight.js/styles/atom-one-light.css";

interface EditorProps {
  // ydoc: Y.Doc;
  provider: HocuspocusProvider;
}

const Editor = (props: EditorProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const session = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const pageQuery = usePageQuery(router.query.pageId as string);
  const updatePageMutation = useUpdatePageMutation(queryClient);

  const titleEditor = useEditor({
    extensions: [Document, Text, Heading.configure({ levels: [1] })],
    content: pageQuery.data?.pageName,
    onUpdate() {
      setIsEditing(true);
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
        document: false,
        history: false,
        heading: false,
        codeBlock: false,
      }),
      Link,
      TaskList,
      CustomDocument,
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
      Collaboration.configure({
        document: props.provider.document,
      }),
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

    onCreate({ editor }) {
      // set last accessed time for recent pages feature
      updatePageMutation.mutate({
        id: router.query.pageId as string,
        accessedAt: new Date(Date.now()).toISOString(),
      });

      // set pageId for later access from prose-mirror extensions
      editor.storage.doc.pageId = pageQuery.data?.id;
    },
  });

  // Mutate remote data on title edit
  useEffect(() => {
    if (!isEditing) return;

    const timeout = setTimeout(() => {
      updatePageMutation.mutate({
        id: router.query.pageId as string,
        pageName: titleEditor?.getText(),
      });
      setIsEditing(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [isEditing, router.query.pageId, titleEditor, updatePageMutation]);

  // Sync remote data with editor content, only when not editing
  useEffect(() => {
    if (pageQuery.isLoading || pageQuery.isError) return;
    if (!titleEditor) return;
    if (titleEditor.isFocused) return;

    titleEditor.commands.setContent(pageQuery.data.pageName);
  }, [pageQuery.data, pageQuery.isError, pageQuery.isLoading, titleEditor]);

  return (
    <>
      {!pageQuery.isLoading && !pageQuery.isError && pageQuery.data && (
        <EditorContent
          editor={titleEditor}
          className={clsx(
            "mx-auto h-full w-full break-words bg-background px-8 pb-6 pt-12 text-4xl font-semibold dark:prose-invert selection:bg-primary dark:selection:bg-[#315EC1]",
            "max-w-sm md:max-w-2xl lg:max-w-3xl" // controls the width of the editor
          )}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            contentEditor?.commands.focus("start");
          }}
        />
      )}

      {contentEditor && (
        <EditorContent
          spellCheck={false}
          className={clsx(
            "prose prose-neutral mx-auto h-full w-full break-words bg-background px-8 pb-6 text-base dark:prose-invert selection:bg-primary dark:selection:bg-[#315EC1]",
            "max-w-sm md:max-w-2xl lg:max-w-3xl" // controls the width of the editor
          )}
          editor={contentEditor}
          // Prevent Tab key from escaping editor
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            event.preventDefault();
          }}
        >
          <SelectMenu editor={contentEditor} />
        </EditorContent>
      )}
    </>
  );
};

export default Editor;
