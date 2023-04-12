import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { getServerSession, Session } from "next-auth";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import clsx from "clsx";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import { InstantSearch } from "react-instantsearch-hooks-web";

import Tiptap from "@/components/Tiptap";
import Sidebar from "@/components/Sidebar";
import PageList from "@/components/PageList";
import Profile from "@/components/Profile";
import EditorPane from "@/components/EditorPane";
import EditorToolbar from "@/components/EditorToolbar";
import { authOptions } from "../api/auth/[...nextauth]";

import { usePageQuery } from "@/hooks/queryHooks";
import { inter } from "@/pages/_app";
import { roboto } from "@/pages/_app";
import useSearchAPIKey from "@/hooks/useSearchAPIKey";

const NoSSRTiptap = dynamic(() => import("@/components/Tiptap"), {
  ssr: false,
});

export default function App() {
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
          host: "localhost",
          port: 8108,
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

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getServerSession(context.req, context.res, authOptions);

//   if (!session)
//     return { redirect: { destination: "/api/auth/signin", permanent: false } };

//   return {
//     props: {
//       session: session,
//     },
//   };
// };
