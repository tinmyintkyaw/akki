import { useEffect } from "react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { usePageQuery, useUpdatePageMutation } from "@/hooks/queryHooks";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

export default function BlockquoteWrapper(props: NodeViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pageQuery = usePageQuery(router.query.pageId as string);

  const updatePageMutation = useUpdatePageMutation(
    pageQuery.data.id as string,
    props.node.textContent ? props.node.textContent : "Untitled",
    pageQuery.data.parentPageId,
    queryClient
  );

  useEffect(() => {
    if (!pageQuery.data) return;
    if (pageQuery.data.pageName === props.node.textContent) return;
    if (pageQuery.data.pageName === "Untitled" && !props.node.textContent)
      return;

    const timeout = setTimeout(() => {
      updatePageMutation.mutate();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [props.node.textContent, pageQuery, queryClient, updatePageMutation]);

  return (
    <NodeViewWrapper>
      <NodeViewContent as="h1" />
    </NodeViewWrapper>
  );
}
