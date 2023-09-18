import RightPaneError from "@/RightPaneError";
import DeletedPageBanner from "@/components/editor/DeletedPageBanner";
import Toolbar from "@/components/toolbar/Toolbar";
import useMultiplayerProvider from "@/hooks/editor/useMultiplayerProvider";
import { usePageQuery } from "@/hooks/pageQueryHooks";
import clsx from "clsx";
import { Suspense, lazy, useEffect } from "react";
import { useParams } from "react-router-dom";

const Editor = lazy(() => import("@/components/editor/Editor"));

export default function RightPane() {
  const params = useParams();
  const pageQuery = usePageQuery(params.pageId ?? "");
  const multiplayerProvider = useMultiplayerProvider(params.pageId ?? "");

  useEffect(() => {
    if (pageQuery.isLoading || pageQuery.isError) return;
    document.title = pageQuery.data.pageName;
  }, [pageQuery.data, pageQuery.isError, pageQuery.isLoading]);

  return (
    <>
      <Toolbar
        title={pageQuery.data ? pageQuery.data.pageName : "Loading..."}
      />

      {!pageQuery.isLoading && pageQuery.isError && <RightPaneError />}

      {!pageQuery.isLoading && !pageQuery.isError && (
        <>
          {pageQuery.data.isDeleted && (
            <DeletedPageBanner pageId={pageQuery.data.id} />
          )}

          <div
            className={clsx(
              "scrollbar-thin h-[calc(100vh-3rem)] overflow-y-auto",
              pageQuery.data.isDeleted && "h-[calc(100vh-6rem)]",
            )}
          >
            {multiplayerProvider.provider && multiplayerProvider.isReady && (
              <Suspense>
                <Editor provider={multiplayerProvider.provider} />
              </Suspense>
            )}
          </div>
        </>
      )}
    </>
  );
}
