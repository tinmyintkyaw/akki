import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { usePageQuery, useUndoDeletePageMutation } from "@/hooks/queryHooks";

type EditorPaneProps = {
  editorComponent: ReactNode;
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
    <div id="editor-pane" className="w-full pt-12">
      <ScrollArea.Root
        type="auto"
        className="h-[calc(100vh-3rem)] w-full bg-slate-50"
      >
        {!pageQuery.isLoading &&
          !pageQuery.isError &&
          pageQuery.data.isDeleted && (
            <div className="flex w-full items-center justify-center gap-4 bg-red-400 py-2 text-sm text-neutral-200">
              <p>This page is currently in Trash</p>
              <button
                onClick={() => undoDeletePageMutation.mutate()}
                className="rounded border border-neutral-300 px-4 py-1 hover:bg-red-600"
              >
                Restore
              </button>
            </div>
          )}

        <ScrollArea.Viewport className="outline-none">
          {props.editorComponent}
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="vertical" className="select-none">
          <ScrollArea.Thumb className="min-w-[0.5rem] bg-stone-400 hover:bg-stone-500" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
