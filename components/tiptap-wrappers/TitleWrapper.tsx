import { useEffect } from "react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

import { usePageQuery, useUpdatePageMutation } from "@/hooks/queryHooks";
import clsx from "clsx";

export default function BlockquoteWrapper(props: NodeViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const pageQuery = usePageQuery(router.query.pageId as string);

  const updatePageMutation = useUpdatePageMutation({
    id: pageQuery.data.id as string,
    pageName: props.node.textContent ? props.node.textContent : "Untitled",
    queryClient,
  });

  useEffect(() => {
    if (
      props.node.textContent === pageQuery.data.pageName ||
      (!props.node.textContent && pageQuery.data.pageName === "Untitled")
    )
      return;

    const timeout = setTimeout(() => updatePageMutation.mutate(), 500);

    return () => clearTimeout(timeout);
  }, [pageQuery.data.pageName, props.node.textContent, updatePageMutation]);

  return (
    <NodeViewWrapper
      className={clsx(
        "mb-6 mt-4 box-border w-full text-4xl font-medium",
        !props.node.textContent &&
          "before:pointer-events-none before:float-left before:h-0 before:text-4xl before:text-stone-400 before:content-['Untitled']"
      )}
    >
      <NodeViewContent as="h1" />
    </NodeViewWrapper>
  );
}
