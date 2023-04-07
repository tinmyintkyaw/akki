import { useDeletePageMutation, usePageListQuery } from "@/hooks/queryHooks";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { HiOutlineDocumentText } from "react-icons/hi2";

import SidebarMenuLink from "./SidebarMenuLink";

const PageItem = (props: { page: any; router: any }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  function toggleCollapsed() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className="ml-2">
      <SidebarMenuLink
        pageId={props.page.id}
        parentPageId={props.page.parentPageId}
        text={props.page.pageName}
        icon={HiOutlineDocumentText}
        isOpen={props.page.id === props.router.query.pageId}
        isCollapsed={isCollapsed}
        setIsCollasped={toggleCollapsed}
      />

      {!isCollapsed &&
        props.page.childPages &&
        props.page.childPages.map((page: any) => (
          <PageItem key={page.id} page={page} router={props.router} />
        ))}

      {!isCollapsed && props.page.childPages.length <= 0 && (
        <div className="my-1 ml-8 text-gray-500">No Pages</div>
      )}
    </div>
  );
};

type PageListProps = {};

export default function PageList(props: PageListProps) {
  const router = useRouter();
  const pageListQuery = usePageListQuery();

  useEffect(() => console.log("first render"), []);

  return (
    <ScrollArea.Root type="auto">
      <ScrollArea.Viewport className="h-[calc(100vh-6rem)] border-stone-300 pr-2 text-sm">
        <h2 className="px-4 py-2 text-xs font-semibold">Pages</h2>

        {pageListQuery.data &&
          pageListQuery.data.map((page: any) => {
            return <PageItem key={page.id} page={page} router={router} />;
          })}
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb className="min-w-[0.5rem] bg-stone-300" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
