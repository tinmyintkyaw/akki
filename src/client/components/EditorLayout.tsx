import DeletedPageBanner from "@/components/editor/DeletedPageBanner";
import PageNotFound from "@/components/error/PageNotFound";
import useMultiplayerProvider from "@/hooks/editor/useMultiplayerProvider";
import { usePageQuery } from "@/hooks/pageQueryHooks";
import clsx from "clsx";
import { Suspense, lazy, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditorComponent = lazy(() => import("@/components/editor/Editor"));

export default function EditorLayout() {
  const params = useParams();
  const pageQuery = usePageQuery(params.pageId ?? "");
  const multiplayerProvider = useMultiplayerProvider(params.pageId ?? "");

  useEffect(() => {
    if (pageQuery.isLoading || pageQuery.isError) return;
    document.title = pageQuery.data.pageName;
  }, [pageQuery.data, pageQuery.isError, pageQuery.isLoading]);

  return (
    <>
      {!pageQuery.isLoading && pageQuery.isError && <PageNotFound />}

      {!pageQuery.isLoading && !pageQuery.isError && (
        <>
          {pageQuery.data.isDeleted && (
            <DeletedPageBanner pageId={pageQuery.data.id} />
          )}

          <div
            className={clsx(
              "h-[calc(100vh-3rem)] overflow-y-auto scrollbar-thin",
              pageQuery.data.isDeleted && "h-[calc(100vh-6rem)]",
            )}
          >
            {multiplayerProvider.provider && multiplayerProvider.isReady && (
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
