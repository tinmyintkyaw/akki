import { useCreatePageMutation, usePageListQuery } from "@/hooks/queryHooks";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdAdd, MdOutlineDescription } from "react-icons/md";

import SidebarMenuLink from "./SidebarMenuLink";

const PageItem = (props: { page: any }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const router = useRouter();

  function toggleCollapsed() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className="ml-2">
      <SidebarMenuLink
        pageId={props.page.id}
        parentPageId={props.page.parentPageId}
        isFavourite={props.page.isFavourite}
        text={props.page.pageName}
        icon={MdOutlineDescription}
        isOpen={props.page.id === router.query.pageId}
        isCollapsed={isCollapsed}
        setIsCollasped={toggleCollapsed}
      />

      {!isCollapsed &&
        props.page.childPages &&
        props.page.childPages.map((page: any) => (
          <PageItem key={page.id} page={page} />
        ))}

      {!isCollapsed && props.page.childPages.length <= 0 && (
        <div className="my-1 ml-8 text-gray-500">No Pages</div>
      )}
    </div>
  );
};

export default function PageList() {
  const [isFavouritesOpen, setIsFavouritesOpen] = useState(true);

  const queryClient = useQueryClient();
  const pageListQuery = usePageListQuery();
  const createPageMutation = useCreatePageMutation(
    "Untitled",
    null,
    queryClient
  );

  return (
    <ScrollArea.Root type="auto">
      <ScrollArea.Viewport className="flex h-[calc(100vh-3rem)] pr-2 text-sm">
        {/* Favourites List */}
        <div className="flex w-full flex-row">
          <button
            onClick={() => setIsFavouritesOpen((prev) => !prev)}
            className="mx-4 my-1 rounded p-1 text-xs font-semibold hover:bg-zinc-200"
          >
            Favourites
          </button>
        </div>

        {isFavouritesOpen &&
          pageListQuery.data &&
          pageListQuery.data
            .filter((page: any) => page.isFavourite)
            .map((page: any) => <PageItem key={page.id} page={page} />)}

        {/* Page List */}
        <div className="flex w-full flex-row">
          <h2 className="mx-4 my-1 rounded p-1 text-xs font-semibold">Pages</h2>
        </div>

        {pageListQuery.data &&
          pageListQuery.data.map((page: any) => {
            return <PageItem key={page.id} page={page} />;
          })}

        {/* Add Page Button */}
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
