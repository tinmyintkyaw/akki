import DeletedPageBanner from "@/components/editor/DeletedPageBanner";
import PageNotFound from "@/components/error/PageNotFound";
import useMultiplayerProvider from "@/hooks/editor/useMultiplayerProvider";
import { usePageQuery } from "@/hooks/pageQueryHooks";
import useStore from "@/zustand/store";
import { WebSocketStatus } from "@hocuspocus/provider";
import clsx from "clsx";
import { Suspense, lazy, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditorComponent = lazy(() => import("@/components/editor/Editor"));

export default function EditorLayout() {
  const params = useParams();
  const pageQuery = usePageQuery(params.pageId ?? "");
  const multiplayerProvider = useMultiplayerProvider(params.pageId ?? "");

  const isAuthenticated = useStore((state) => state.isWSAuthenticated);
  const wsConnectionStatus = useStore((state) => state.wsConnectionStatus);
  const isSynced = useStore((state) => state.isWSSynced);

  useEffect(() => {
    if (pageQuery.isLoading || pageQuery.isError || !pageQuery.data) return;
    document.title = `${pageQuery.data.pageName} | Okoume`;
  }, [pageQuery.data, pageQuery.isError, pageQuery.isLoading]);

  return (
    <>
      {!pageQuery.isLoading && pageQuery.isError && <PageNotFound />}

      {!pageQuery.isLoading && !pageQuery.isError && pageQuery.data && (
        <>
          {pageQuery.data.deletedAt !== null && (
            <DeletedPageBanner pageId={pageQuery.data.id} />
          )}

          <div
            className={clsx(
              "h-[calc(100vh-3rem)] overflow-y-auto scrollbar-thin",
              pageQuery.data.deletedAt && "h-[calc(100vh-6rem)]",
            )}
          >
            {multiplayerProvider.provider &&
              wsConnectionStatus === WebSocketStatus.Connected &&
              isSynced &&
              isAuthenticated && (
                <Suspense>
                  <EditorComponent provider={multiplayerProvider.provider} />
                </Suspense>
              )}
          </div>
        </>
      )}
    </>
  );
}
