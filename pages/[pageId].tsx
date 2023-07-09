import { useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import { Session, getServerSession } from "next-auth";
import { InstantSearch } from "react-instantsearch-hooks-web";
import * as RadixToast from "@radix-ui/react-toast";

import Sidebar from "@/components/sidebar/Sidebar";
import PageList from "@/components/sidebar/PageList";
import EditorPane from "@/components/EditorPane";
import EditorToolbar from "@/components/EditorToolbar";

import { usePageQuery } from "@/hooks/queryHooks";
import { inter } from "@/pages/_app";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const NoSSRTiptap = dynamic(() => import("@/components/Tiptap"), {
  ssr: false,
});

type AppProps = {
  session: Session;
};

const TYPESENSE_HOST = process.env.TYPESENSE_HOST || "localhost";
const TYPESENSE_PORT = process.env.TYPESENSE_PORT
  ? parseInt(process.env.TYPESENSE_PORT)
  : 8108;

export const typesenseInstantSearchAdaptor = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "",
    nodes: [
      {
        host: TYPESENSE_HOST,
        port: TYPESENSE_PORT,
        protocol: "http",
      },
    ],
  },
  additionalSearchParameters: {
    query_by: "pageName,pageTextContent",
  },
});

const searchClient = typesenseInstantSearchAdaptor.searchClient;

export default function App(props: AppProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { pageId } = useRouter().query;

  const pageQuery = usePageQuery(pageId as string);

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
        <RadixToast.Provider>
          <main className={`${inter.className} relative h-screen w-screen`}>
            <EditorToolbar setIsOpen={() => setIsSidebarOpen((old) => !old)} />

            <div className="flex h-screen">
              <Sidebar
                isOpen={isSidebarOpen}
                pageListComponent={<PageList />}
              />

              {!pageQuery.data && !pageQuery.isLoading && (
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

          <RadixToast.Viewport
            className={`${inter.className} fixed bottom-6 left-1/2 z-50 -ml-24 w-80 outline-none`}
          />
        </RadixToast.Provider>
      </InstantSearch>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session)
    return { redirect: { destination: "/api/auth/signin", permanent: false } };

  return {
    props: {
      session: session,
    },
  };
};
