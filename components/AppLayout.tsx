import { Allotment, LayoutPriority } from "allotment";
import { useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { FC, ReactNode, useContext } from "react";
import { InstantSearch } from "react-instantsearch-hooks-web";

import Sidebar from "./sidebar/Sidebar";

import { usePageQuery } from "@/hooks/pageQueryHooks";
import useInstantSearchClient from "@/hooks/search/useInstantSearchClient";

import { SidebarContext } from "@/contexts/SidebarContext";
import "allotment/dist/style.css";

const AppLayout: FC<{ children: ReactNode }> = (props) => {
  const sidebarContext = useContext(SidebarContext);

  const queryClient = useQueryClient();
  const instantSearchClient = useInstantSearchClient();
  const router = useRouter();
  const pageQuery = usePageQuery(router.query.pageId as string);

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
        <Allotment
          proportionalLayout={false}
          separator={sidebarContext.isSidebarOpen}
        >
          <Allotment.Pane
            minSize={250}
            preferredSize={350}
            maxSize={600}
            priority={LayoutPriority.Low}
            visible={sidebarContext.isSidebarOpen}
          >
            <Sidebar
              isOpen={sidebarContext.isSidebarOpen}
              toggleIsOpen={sidebarContext.toggleSidebarOpen}
            />
          </Allotment.Pane>

          <Allotment.Pane
          // className="contentPane transition-all will-change-[width] duration-300 ease-in-out"
          >
            {props.children}
          </Allotment.Pane>
        </Allotment>
      </InstantSearch>
    </main>
  );
};

export default AppLayout;
