import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  usePageQuery,
  useRecentPagesQuery,
  usePermanentlyDeletePageMutation,
  useUndoDeletePageMutation,
} from "@/hooks/pageQueryHooks";
import { ScrollArea } from "./ui/scroll-area";

type EditorPaneProps = {
  editorComponent: ReactNode;
  toolbarComponent: ReactNode;
};

export default function EditorPane(props: EditorPaneProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pageQuery = usePageQuery(router.query.pageId as string);
  const recentPagesQuery = useRecentPagesQuery();
  const undoDeletePageMutation = useUndoDeletePageMutation(queryClient);
  const permanentlyDeletePageMutation =
    usePermanentlyDeletePageMutation(queryClient);

  return (
    <div id="editor-pane" className="w-full">
      {props.toolbarComponent}

      {!pageQuery.isLoading && !pageQuery.isError && (
        <>
          {pageQuery.data.isDeleted && (
            <div className="flex h-12 w-full items-center justify-center gap-4 bg-destructive py-2 text-sm text-destructive-foreground">
              <p>This page is currently in Trash</p>
              <button
                onClick={() =>
                  undoDeletePageMutation.mutate({
                    id: router.query.pageId as string,
                  })
                }
                className="rounded border border-neutral-300 px-4 py-1 hover:bg-destructive-foreground/10"
              >
                Restore
              </button>

              <button
                onClick={async () => {
                  permanentlyDeletePageMutation.mutate({
                    id: router.query.pageId as string,
                  });
                  await recentPagesQuery.refetch();

                  if (
                    recentPagesQuery.isError ||
                    !recentPagesQuery.data ||
                    !recentPagesQuery.data[0]
                  )
                    return router.push("/new");

                  router.push(`/${recentPagesQuery.data[0].id}`);
                }}
                className="rounded border border-neutral-300 px-4 py-1 hover:bg-destructive-foreground/10"
              >
                Delete Permanently
              </button>
            </div>
          )}

          <ScrollArea
            type="auto"
            className={`${
              !pageQuery.data.isDeleted
                ? "h-[calc(100vh-3rem)]"
                : "h-[calc(100vh-6rem)]"
            } w-full bg-background outline-none`}
          >
            {props.editorComponent}
          </ScrollArea>
        </>
      )}
    </div>
  );
}
