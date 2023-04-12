import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import { InstantSearch } from "react-instantsearch-hooks-web";

import Sidebar from "@/components/Sidebar";
import PageList from "@/components/PageList";
import EditorPane from "@/components/EditorPane";
import EditorToolbar from "@/components/EditorToolbar";

import { usePageQuery } from "@/hooks/queryHooks";
import { roboto } from "@/pages/_app";
import useSearchAPIKey from "@/hooks/useSearchAPIKey";

const NoSSRTiptap = dynamic(() => import("@/components/Tiptap"), {
  ssr: false,
});

export default function App(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const router = useRouter();
  const { pageId } = router.query;

  const pageQuery = usePageQuery(pageId as string);
  const searchAPIKey = useSearchAPIKey();

  const typesenseInstantSearchAdaptor = new TypesenseInstantSearchAdapter({
    server: {
      apiKey: searchAPIKey.data ? searchAPIKey.data.key : "",
      nodes: [
        {
          host: props.TYPESENSE_HOST,
          port: props.TYPESENSE_PORT,
          protocol: "http",
        },
      ],
    },
    additionalSearchParameters: {
      query_by: "pageName,pageTextContent",
    },
  });

  const searchClient = typesenseInstantSearchAdaptor.searchClient;

  return (
    <>
      <Head>
        <title>{`${
          pageQuery.data ? pageQuery.data.pageName : "Project Potion"
        }`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <InstantSearch searchClient={searchClient} indexName="pages">
        <main className={`${roboto.className} relative h-screen w-screen`}>
          <EditorToolbar setIsOpen={() => setIsSidebarOpen((old) => !old)} />

          <div className="flex h-screen">
            <Sidebar isOpen={isSidebarOpen} pageListComponent={<PageList />} />

            {!pageQuery.data && (
              <div className="flex h-full w-full select-none items-center justify-center">
                <p>Page Not Found!</p>
              </div>
            )}

            {pageQuery.data && (
              <EditorPane
                key={pageQuery.data.id}
                editorComponent={<NoSSRTiptap pageId={pageQuery.data.id} />}
              />
            )}
          </div>
        </main>
      </InstantSearch>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // TODO: client's typesense should be different in production
  const TYPESENSE_HOST = process.env.TYPESENSE_HOST || "localhost";
  const TYPESENSE_PORT = process.env.TYPESENSE_PORT
    ? parseInt(process.env.TYPESENSE_PORT)
    : 8108;

  return {
    props: {
      TYPESENSE_HOST,
      TYPESENSE_PORT,
    },
  };
};
