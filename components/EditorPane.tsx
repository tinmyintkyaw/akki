import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { usePageQuery, useUndoDeletePageMutation } from "@/hooks/queryHooks";

type EditorPaneProps = {
  editorComponent: ReactNode;
  toolbarComponent: ReactNode;
};

export default function EditorPane(props: EditorPaneProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pageQuery = usePageQuery(router.query.pageId as string);
  const undoDeletePageMutation = useUndoDeletePageMutation(
    router.query.pageId as string,
    queryClient
  );

  return (
    <div id="editor-pane" className="w-full">
      {props.toolbarComponent}

      {!pageQuery.isLoading && !pageQuery.isError && (
        <>
          {pageQuery.data.isDeleted && (
            <div className="flex h-12 w-full items-center justify-center gap-4 bg-destructive py-2 text-sm text-destructive-foreground">
              <p>This page is currently in Trash</p>
              <button
                onClick={() => undoDeletePageMutation.mutate()}
                className="rounded border border-neutral-300 px-4 py-1 hover:bg-destructive-foreground/10"
              >
                Restore
              </button>
            </div>
          )}

          <ScrollArea.Root type="auto">
            <ScrollArea.Viewport
              className={`${
                !pageQuery.data.isDeleted
                  ? "h-[calc(100vh-3rem)]"
                  : "h-[calc(100vh-6rem)]"
              } w-full bg-background outline-none`}
            >
              {props.editorComponent}
            </ScrollArea.Viewport>

            <ScrollArea.Scrollbar
              orientation="vertical"
              className="select-none"
            >
              <ScrollArea.Thumb className="min-w-[0.5rem] bg-primary/40 hover:bg-primary/60" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </>
      )}
    </div>
  );
}
