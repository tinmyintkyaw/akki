import AppLayout from "@/components/AppLayout";
import { useSession } from "next-auth/react";

import Editor from "@/components/editor/Editor";
import useMultiplayerProvider from "@/hooks/useMultiplayerProvider";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { usePageQuery } from "@/hooks/pageQueryHooks";
import PageNotFound from "@/components/editor/PageNotFound";
import clsx from "clsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeletedPageBanner from "@/components/editor/DeletedPageBanner";
import Toolbar from "@/components/toolbar/Toolbar";

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

  if (session.status === "loading") return <></>;

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
                    "h-[calc(100vh-3rem)] w-full bg-background outline-none",
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
