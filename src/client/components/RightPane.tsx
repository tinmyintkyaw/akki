import RightPaneError from "@/RightPaneError";
import DeletedPageBanner from "@/components/editor/DeletedPageBanner";
import Editor from "@/components/editor/Editor";
import Toolbar from "@/components/toolbar/Toolbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import useMultiplayerProvider from "@/hooks/editor/useMultiplayerProvider";
import { usePageQuery } from "@/hooks/pageQueryHooks";
import clsx from "clsx";
import { useParams } from "react-router-dom";

export default function RightPane() {
  const params = useParams();
  const pageQuery = usePageQuery(params.pageId ?? "");
  const multiplayerProvider = useMultiplayerProvider(params.pageId ?? "");

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

          <ScrollArea
            type="auto"
            className={clsx(
              "h-[calc(100vh-3rem)] w-full",
              pageQuery.data.isDeleted && "h-[calc(100vh-6rem)]",
            )}
          >
            {multiplayerProvider.provider && multiplayerProvider.isReady && (
              <Editor provider={multiplayerProvider.provider} />
            )}
          </ScrollArea>
        </>
      )}
    </>
  );
}
