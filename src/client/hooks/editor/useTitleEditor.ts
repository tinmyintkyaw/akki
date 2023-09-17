import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Text from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { usePageQuery, useUpdatePageMutation } from "../pageQueryHooks";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const useTitleEditor = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const params = useParams();
  const queryClient = useQueryClient();
  const pageQuery = usePageQuery(params.pageId ?? "");
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
        id: params.pageId ?? "",
        pageName: titleEditor?.getText(),
      });
      setIsEditing(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [isEditing, params.pageId, titleEditor, updatePageMutation]);

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
