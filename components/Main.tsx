import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { InstantSearch } from "react-instantsearch-hooks-web";
import { Allotment, LayoutPriority } from "allotment";

import EditorPane from "@/components/EditorPane";
import EditorToolbar from "@/components/EditorToolbar";
import ProfileDropdown from "@/components/ProfileDropdown";

import useInstantSearchClient from "@/hooks/useInstantSearchClient";
import { usePageQuery } from "@/hooks/pageQueryHooks";

import "allotment/dist/style.css";
import Sidebar from "./sidebar/Sidebar";

const AppHome = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const { pageId } = useRouter().query;
  const pageQuery = usePageQuery(pageId as string);
  const instantSearchClient = useInstantSearchClient();

  return (
    <main className="h-screen w-screen">
      <Head>
        <title>{`${
          pageQuery.data ? pageQuery.data.pageName : "Project Potion"
        }`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <InstantSearch searchClient={instantSearchClient} indexName="pages">
        <Allotment proportionalLayout={false} separator={!!isSidePanelOpen}>
          <Allotment.Pane
            minSize={250}
            preferredSize={350}
            maxSize={600}
            priority={LayoutPriority.Low}
            visible={isSidePanelOpen}
          >
            <Sidebar isOpen={isSidePanelOpen} setIsOpen={setIsSidePanelOpen} />
          </Allotment.Pane>

          <Allotment.Pane
          // className="contentPane transition-all will-change-[width] duration-300 ease-in-out"
          >
            <EditorPane>
              <EditorToolbar
                isSidebarOpen={isSidePanelOpen}
                setIsSidebarOpen={() => setIsSidePanelOpen((prev) => !prev)}
              />
            </EditorPane>
          </Allotment.Pane>
        </Allotment>
      </InstantSearch>
    </main>
  );
};

export default AppHome;
