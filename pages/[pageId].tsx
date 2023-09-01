import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import useMultiplayerProvider from "@/hooks/editor/useMultiplayerProvider";
import { usePageQuery } from "@/hooks/pageQueryHooks";

import AppLayout from "@/components/AppLayout";
import DeletedPageBanner from "@/components/editor/DeletedPageBanner";
import Editor from "@/components/editor/Editor";
import PageNotFound from "@/components/editor/PageNotFound";
import Toolbar from "@/components/toolbar/Toolbar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function App() {
  const session = useSession();
  const router = useRouter();

  const pageQuery = usePageQuery(router.query.pageId as string);
  const multiplayerProvider = useMultiplayerProvider(
    pageQuery.data ? pageQuery.data.id : ""
  );

  useEffect(() => {
    if (session.status !== "unauthenticated") return;
    router.push("/signin");
  }, [router, session.status]);

  if (session.status === "loading" || session.status === "unauthenticated")
    return <></>;

  return (
    <AppLayout>
      <Toolbar />

      {!pageQuery.isLoading && (
        <>
          {!pageQuery.isError ? (
            <>
              {pageQuery.data.isDeleted && (
                <DeletedPageBanner pageId={pageQuery.data.id} />
              )}

              {multiplayerProvider.provider && multiplayerProvider.isReady && (
                <ScrollArea
                  type="auto"
                  className={clsx(
                    "h-[calc(100vh-3rem)] w-full",
                    pageQuery.data.isDeleted && "h-[calc(100vh-6rem)]"
                  )}
                >
                  <Editor provider={multiplayerProvider.provider} />
                </ScrollArea>
              )}
            </>
          ) : (
            <>{pageQuery.error.status === 404 && <PageNotFound />}</>
          )}
        </>
      )}
    </AppLayout>
  );
}
