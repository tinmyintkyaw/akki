import SearchComboBox from "@/components/search/SearchComboBox";
import ToolbarDropdown from "@/components/toolbar/ToolbarDropdown";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePageQuery, useRecentPagesQuery } from "@/hooks/pageQueryHooks";
import { MoreHorizontal, Search } from "lucide-react";
import { useParams } from "react-router-dom";

function Toolbar() {
  const params = useParams();
  const pageQuery = usePageQuery(params.pageId ?? "");
  const recentPageListQuery = useRecentPagesQuery();

  // const isSidebarOpen = useStore((state) => state.isSidebarOpen);
  // const toggleSidebarOpen = useStore((state) => state.toggleSidebarOpen);

  return (
    <div
      id="editor-toolbar"
      className="inline-flex h-12 w-full select-none items-center gap-2 border-b border-border bg-background px-2 text-foreground"
    >
      {/* {!isSidebarOpen && (
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={toggleSidebarOpen}
          className="flex-shrink-0"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </Button>
      )} */}

      <SidebarTrigger />

      <Button variant={"ghost"} size={"default"} className="justify-start">
        <span className="line-clamp-1 text-start">
          {pageQuery.data
            ? pageQuery.data.pageName
            : pageQuery.error?.status === 404
              ? "Page Not Found"
              : recentPageListQuery.data?.length === 0
                ? "No Pages"
                : ""}
        </span>
      </Button>

      <div className="flex-grow" />

      <SearchComboBox>
        <Button variant={"ghost"} size={"icon"} className="flex-shrink-0">
          <Search className="h-5 w-5" />
        </Button>
      </SearchComboBox>

      <ToolbarDropdown>
        <Button variant={"ghost"} size={"icon"} className="flex-shrink-0">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </ToolbarDropdown>
    </div>
  );
}

export default Toolbar;
