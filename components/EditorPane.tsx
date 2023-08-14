import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  usePageQuery,
  usePermanentlyDeletePageMutation,
  useUndoDeletePageMutation,
} from "@/hooks/pageQueryHooks";
import { ScrollArea } from "./ui/scroll-area";
import useMultiplayerProvider from "@/hooks/useMultiplayerProvider";
import Editor from "./Editor";
import clsx from "clsx";
import { Button } from "./ui/button";

interface EditorPaneProps {
  children: ReactNode;
}

export default function EditorPane(props: EditorPaneProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pageQuery = usePageQuery(router.query.pageId as string);
  const undoDeletePageMutation = useUndoDeletePageMutation(queryClient);
  const permanentlyDeletePageMutation =
    usePermanentlyDeletePageMutation(queryClient);

  const [currentPageId, setCurrentPageId] = useState<string>("");
  const { providerRef, isReady, status, isAuthenticated } =
    useMultiplayerProvider(currentPageId);

  useEffect(() => {
    if (!router.isReady) return;
    if (typeof router.query.pageId !== "string") return;
    setCurrentPageId(router.query.pageId);
  }, [router.isReady, router.query.pageId]);

  return (
    <>
      {props.children}

      {/* Deleted Page Banner */}
      {!pageQuery.isLoading &&
        !pageQuery.isError &&
        pageQuery.data.isDeleted && (
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
                router.push("/");
              }}
              className="rounded border border-neutral-300 px-4 py-1 hover:bg-destructive-foreground/10"
            >
              Delete Permanently
            </button>
          </div>
        )}

      {/* Editor */}
      {!pageQuery.isLoading && !pageQuery.isError && (
        <ScrollArea
          type="auto"
          className={clsx(
            "h-[calc(100vh-3rem)] w-full bg-background outline-none",
            pageQuery.data.isDeleted && "h-[calc(100vh-6rem)]"
          )}
        >
          {providerRef.current && isReady && (
            <Editor provider={providerRef.current} />
          )}
        </ScrollArea>
      )}

      {/* Error */}
      {!pageQuery.isLoading && pageQuery.isError && (
        <div className="flex h-full w-full select-none flex-col items-center justify-center">
          <h1 className="mb-4 text-lg font-medium">
            {!pageQuery.isLoading && pageQuery.error.status === 404
              ? "Page Not Found"
              : "Error"}
          </h1>
          <Button
            variant={"outline"}
            size={"default"}
            onClick={() => router.push("/")}
          >
            <span>Back to my content</span>
          </Button>
        </div>
      )}
    </>
  );
}
