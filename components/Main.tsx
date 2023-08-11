import { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { InstantSearch } from "react-instantsearch-hooks-web";
import { Allotment, LayoutPriority } from "allotment";
import * as RadixToast from "@radix-ui/react-toast";

import PageList from "@/components/sidebar/PageList";
import EditorPane from "@/components/EditorPane";
import EditorToolbar from "@/components/EditorToolbar";
import ProfileDropdown from "@/components/ProfileDropdown";
const Tiptap = dynamic(() => import("@/components/Tiptap"));

import useInstantSearchClient from "@/hooks/useInstantSearchClient";
import { usePageQuery } from "@/hooks/pageQueryHooks";

import "allotment/dist/style.css";

const AppHome = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const { pageId } = useRouter().query;
  const pageQuery = usePageQuery(pageId as string);
  const instantSearchClient = useInstantSearchClient();

  return (
    <>
      <Head>
        <title>{`${
          pageQuery.data ? pageQuery.data.pageName : "Project Potion"
        }`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <InstantSearch searchClient={instantSearchClient} indexName="pages">
        <RadixToast.Provider>
          <main className="h-screen w-screen">
            <Allotment proportionalLayout={false} separator={!!isSidePanelOpen}>
              <Allotment.Pane
                minSize={250}
                preferredSize={350}
                maxSize={600}
                priority={LayoutPriority.Low}
                visible={isSidePanelOpen}
              >
                <ProfileDropdown
                  isSidebarOpen={isSidePanelOpen}
                  setIsSidebarOpen={() => setIsSidePanelOpen((prev) => !prev)}
                />
                <PageList />
              </Allotment.Pane>

              <Allotment.Pane className="contentPane transition-all will-change-[width] duration-300 ease-in-out">
                {!pageQuery.isLoading && pageQuery.isError && (
                  <div className="flex h-full w-full select-none items-center justify-center">
                    {/* TODO: Add proper error components */}
                    {pageQuery.error.status === 404 ? (
                      <p>Page Not Found!</p>
                    ) : (
                      <p>Error!</p>
                    )}
                  </div>
                )}

                {!pageQuery.isLoading && !pageQuery.isError && (
                  <EditorPane
                    key={pageQuery.data.id}
                    editorComponent={<Tiptap pageId={pageQuery.data.id} />}
                    toolbarComponent={
                      <EditorToolbar
                        isSidebarOpen={isSidePanelOpen}
                        setIsSidebarOpen={() =>
                          setIsSidePanelOpen((prev) => !prev)
                        }
                      />
                    }
                  />
                )}
              </Allotment.Pane>
            </Allotment>
          </main>

          <RadixToast.Viewport className="fixed bottom-6 left-1/2 z-50 -ml-24 w-80 outline-none" />
        </RadixToast.Provider>
      </InstantSearch>
    </>
  );
};

export default AppHome;
