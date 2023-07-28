import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import clsx from "clsx";

import { MdOutlineDescription } from "react-icons/md";
import { FileText, Plus } from "lucide-react";

import {
  useCreatePageMutation,
  useFavouritePagesQuery,
  usePageListQuery,
} from "@/hooks/queryHooks";

import SidebarMenuLink from "./SidebarMenuLink";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import DeletedPages from "./DeletedPages";

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
        <div className="my-1 ml-8 text-muted-foreground">No Pages</div>
      )}
    </div>
  );
};

export default function PageList() {
  const [isFavouritesOpen, setIsFavouritesOpen] = useState(true);

  const router = useRouter();
  const queryClient = useQueryClient();
  const pageListQuery = usePageListQuery();
  const favouritePagesQuery = useFavouritePagesQuery();
  const createPageMutation = useCreatePageMutation(
    "Untitled",
    null,
    queryClient
  );

  return (
    <ScrollArea type="auto" className="flex h-[calc(100vh-3rem)] text-sm">
      {/* Favourites List - hides automatically when there are no favourited pages*/}
      {favouritePagesQuery.data && favouritePagesQuery.data.length > 0 && (
        <div className="mb-2 px-2">
          <button
            onClick={() => setIsFavouritesOpen((prev) => !prev)}
            className="mx-4 my-1 rounded p-1 text-xs font-semibold hover:bg-accent"
          >
            Favourites
          </button>

          {isFavouritesOpen &&
            favouritePagesQuery.data.map((page: any) => (
              <Button
                variant={"ghost"}
                size={"default"}
                key={page.id}
                onClick={() => router.push(`/${page.id}`)}
                className={clsx(
                  page.id === router.query.pageId &&
                    "my-1 bg-accent text-accent-foreground",
                  "w-full"
                )}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span className="line-clamp-1 flex-grow text-start">
                  {page.pageName}
                </span>
              </Button>
            ))}
        </div>
      )}

      {/* Page List */}
      <div className="mb-2 pr-2">
        <div className="flex w-full flex-row">
          <h2 className="mx-4 my-1 rounded p-1 text-xs font-semibold">Pages</h2>
        </div>

        {pageListQuery.data &&
          pageListQuery.data.map((page: any) => {
            return <PageItem key={page.id} page={page} />;
          })}
      </div>

      {/* Add Page Button */}
      <Button
        variant={"ghost"}
        size={"default"}
        onClick={() => createPageMutation.mutate()}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        <span className="flex-grow text-start">Add Page</span>
      </Button>

      <DeletedPages />
    </ScrollArea>
  );
}
