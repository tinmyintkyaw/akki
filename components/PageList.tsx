import { useCreatePageMutation, usePageListQuery } from "@/hooks/queryHooks";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdAdd, MdOutlineDescription } from "react-icons/md";

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
        icon={MdOutlineDescription}
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
  const queryClient = useQueryClient();
  const pageListQuery = usePageListQuery();

  const createPageMutation = useCreatePageMutation(
    "Untitled",
    null,
    queryClient
  );

  return (
    <ScrollArea.Root type="auto">
      <ScrollArea.Viewport className="mb-2 h-[calc(100vh-6.5rem)] border-b border-stone-300 pr-2 text-sm">
        <h2 className="px-4 py-2 text-xs font-semibold">Pages</h2>

        {pageListQuery.data &&
          pageListQuery.data.map((page: any) => {
            return <PageItem key={page.id} page={page} router={router} />;
          })}

        {/* Add Button */}
        <button
          onClick={() => createPageMutation.mutate()}
          className="ml-2 flex h-8 w-[calc(100%-0.5rem)] items-center gap-2 rounded-sm px-2 text-sm text-stone-700 hover:bg-stone-300"
        >
          <MdAdd className="h-4 w-4" />
          <p className="line-clamp-1">Add Page</p>
        </button>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb className="min-w-[0.5rem] bg-stone-300" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
