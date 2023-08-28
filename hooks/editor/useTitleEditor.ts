import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Text from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { usePageQuery, useUpdatePageMutation } from "../pageQueryHooks";
import { useQueryClient } from "@tanstack/react-query";

const useTitleEditor = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

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

  return titleEditor;
};

export default useTitleEditor;
