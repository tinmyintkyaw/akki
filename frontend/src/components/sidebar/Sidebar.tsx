import DeletedPages from "@/components/sidebar/DeletedPages";
import PageTree from "@/components/tree-views/PageTree";
import StarredPageTree from "@/components/tree-views/StarredPageTree";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useCreatePageMutation,
  usePageListQuery,
} from "@/hooks/pageQueryHooks";
import useStore from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { PanelLeftClose, Plus, SquareAsterisk } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [isStarredOpen, setIsStarredOpen] = useState(true);

  const queryClient = useQueryClient();
  const pageListQuery = usePageListQuery();
  const createPageMutation = useCreatePageMutation(queryClient);

  const toggleSidebarOpen = useStore((state) => state.toggleSidebarOpen);

  return (
    <aside className="bg-muted">
      <div className="flex h-12 select-none flex-row items-center justify-between gap-2 px-3">
        <header className="ml-2 flex flex-row justify-start">
          <SquareAsterisk className="mr-2 h-6 w-6" />
          <h1>Project Potion</h1>
        </header>

        <Button variant={"ghost"} size={"icon"} onClick={toggleSidebarOpen}>
          <PanelLeftClose className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea
        type="hover"
        className={clsx("flex h-[calc(100vh-9rem)] text-sm")}
      >
        <div className="px-3 pt-1">
          <Button
            variant={"ghost"}
            size={"default"}
            onClick={() => setIsStarredOpen((prev) => !prev)}
            className="mb-1 h-7 px-2"
          >
            <span className="text-muted-foreground w-full text-start text-[13px] font-medium">
              Starred
            </span>
          </Button>

          {isStarredOpen && <StarredPageTree />}
        </div>

        <div className="px-3 pb-2 pt-1">
          <Button variant={"ghost"} size={"default"} className="mb-1 h-7 px-2">
            <span className="text-muted-foreground w-full text-start text-[13px] font-medium">
              Pages
            </span>
          </Button>

          {pageListQuery.data && pageListQuery.data.length >= 1 ? (
            <PageTree />
          ) : (
            <p className="text-muted-foreground ml-2 w-full text-[13px]">
              No Pages
            </p>
          )}
        </div>
      </ScrollArea>

      <div className="border-border border-t-2 px-3 py-3">
        <Button
          variant={"ghost"}
          className="w-full justify-start"
          onClick={() =>
            createPageMutation.mutate({ pageName: "Untitled", parentId: null })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="align-middle leading-4">New Page</span>
        </Button>

        <DeletedPages />
      </div>
    </aside>
  );
};

export default Sidebar;
