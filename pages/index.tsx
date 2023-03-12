import Head from "next/head";
import Image from "next/image";
import clsx from "clsx";
import dynamic from "next/dynamic";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import { Roboto_Flex } from "@next/font/google";
import Sidebar from "@/components/Sidebar";

const roboto = Roboto_Flex({
  subsets: ["latin"],
});

const NoSSRTiptap = dynamic(() => import("../components/Tiptap"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Project Potion</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={clsx(roboto.className, "flex h-screen w-screen")}>
        <Sidebar />

        <div id="editor-pane" className="h-screen flex-grow">
          <div
            id="editor-toolbar"
            className="sticky top-0 flex h-8 w-full select-none items-center border-b-2 bg-slate-50 px-2"
          >
            <p>Test</p>
          </div>

          <ScrollArea.Root type="auto" className="overflow-hidden">
            <ScrollArea.Viewport className="h-[calc(100vh-2rem)] w-full bg-slate-50">
              <NoSSRTiptap />
            </ScrollArea.Viewport>

            <ScrollArea.Scrollbar
              orientation="vertical"
              className="select-none"
            >
              <ScrollArea.Thumb className="min-w-[0.5rem] bg-stone-400" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </div>
      </main>
    </>
  );
}
