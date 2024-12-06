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

const Sidebar = () => {
  const queryClient = useQueryClient();
  const pageListQuery = usePageListQuery();
  const createPageMutation = useCreatePageMutation(queryClient);

  const toggleSidebarOpen = useStore((state) => state.toggleSidebarOpen);
  const isStarredSectionOpen = useStore((state) => state.isStarredSectionOpen);
  const toggleStarredSectionOpen = useStore(
    (state) => state.toggleStarredSectionOpen,
  );

  return (
    <aside className="border-r border-border bg-muted">
      <div className="flex h-12 select-none flex-row items-center justify-between gap-2 px-3">
        <header className="ml-2 flex flex-row justify-start">
          <SquareAsterisk className="mr-2 h-6 w-6" />
          <h1>Okoume</h1>
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
            onClick={toggleStarredSectionOpen}
            className="mb-1 h-7 px-2"
          >
            <span className="w-full text-start text-[13px] font-medium text-muted-foreground">
              Starred
            </span>
          </Button>

          {isStarredSectionOpen && <StarredPageTree />}
        </div>

        <div className="px-3 pb-2 pt-1">
          <Button variant={"ghost"} size={"default"} className="mb-1 h-7 px-2">
            <span className="w-full text-start text-[13px] font-medium text-muted-foreground">
              Pages
            </span>
          </Button>

          {pageListQuery.data && pageListQuery.data.length >= 1 ? (
            <PageTree />
          ) : (
            <p className="ml-2 w-full text-[13px] text-muted-foreground">
              No Pages
            </p>
          )}
        </div>
      </ScrollArea>

      <div className="border-t-2 border-border px-3 py-3">
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
