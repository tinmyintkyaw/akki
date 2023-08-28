import CustomCodeBlock from "@/tiptap/CustomCodeBlock";
import CustomDocument from "@/tiptap/CustomDocument";
import CustomHeading from "@/tiptap/CustomHeading";
import CustomImageFrontend from "@/tiptap/CustomImageFrontend";
import { useQueryClient } from "@tanstack/react-query";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { usePageQuery, useUpdatePageMutation } from "../pageQueryHooks";
import { useSession } from "next-auth/react";
import { lowlight } from "lowlight/lib/common";
import { useRouter } from "next/router";
import { HocuspocusProvider } from "@hocuspocus/provider";

const useContentEditor = (provider: HocuspocusProvider) => {
  const router = useRouter();
  const session = useSession();
  const queryClient = useQueryClient();
  const pageQuery = usePageQuery(router.query.pageId as string);
  const updatePageMutation = useUpdatePageMutation(queryClient);

  return useEditor({
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
        document: provider.document,
      }),
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
};
export default useContentEditor;
