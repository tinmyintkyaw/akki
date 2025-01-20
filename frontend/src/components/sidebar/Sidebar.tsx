import DeletedPages from "@/components/sidebar/DeletedPages";
import PageTree from "@/components/tree-views/PageTree";
import StarredPageTree from "@/components/tree-views/StarredPageTree";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  useCreatePageMutation,
  usePageListQuery,
} from "@/hooks/pageQueryHooks";
import useStore from "@/zustand/store";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

const AppSidebar = () => {
  const queryClient = useQueryClient();
  const pageListQuery = usePageListQuery();
  const createPageMutation = useCreatePageMutation(queryClient);

  // const toggleSidebarOpen = useStore((state) => state.toggleSidebarOpen);
  const isStarredSectionOpen = useStore((state) => state.isStarredSectionOpen);
  const toggleStarredSectionOpen = useStore(
    (state) => state.toggleStarredSectionOpen,
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <header className="ml-2 flex h-10 flex-row items-center justify-start">
          <img src="/logo.svg" className="mr-2 h-6 w-6" />
          <h1>Akki</h1>
        </header>
      </SidebarHeader>

      <SidebarContent>
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
      </SidebarContent>

      <SidebarFooter>
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
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
