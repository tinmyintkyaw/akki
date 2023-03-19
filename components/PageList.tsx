import { useDeletePageMutation, usePageListQuery } from "@/hooks/queryHooks";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { HiOutlineDocumentText } from "react-icons/hi2";

import SidebarMenuLink from "./SidebarMenuLink";

type PageListProps = {
  // createPageFn: () => void;
};

export default function PageList(props: PageListProps) {
  const pageListQuery = usePageListQuery();

  useEffect(() => console.log("first render"), []);

  return (
    <ScrollArea.Root type="hover">
      <ScrollArea.Viewport className="h-[calc(100vh-6rem)] border-stone-300 pl-2 pr-4">
        <h2 className="px-2 py-2 text-xs font-semibold">Pages</h2>
        {/* {pageListQuery.isLoading && <p>Loading...</p>} */}
        {pageListQuery.isError && <p>Error</p>}

        {pageListQuery.data &&
          pageListQuery.data.map((page) => (
            <SidebarMenuLink
              key={page.id}
              pageId={page.id}
              parentPageId={page.parentPageId}
              text={page.pageName}
              icon={HiOutlineDocumentText}
            />
          ))}
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb className="min-w-[0.5rem] bg-stone-300" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
