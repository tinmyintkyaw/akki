import SearchComboBox from "@/components/search/SearchComboBox";
import ToolbarDropdown from "@/components/toolbar/ToolbarDropdown";
import { Button } from "@/components/ui/button";
import { SidebarContext } from "@/contexts/SidebarContext";
import { usePageQuery } from "@/hooks/pageQueryHooks";
import { MoreHorizontal, PanelLeftOpen, Search } from "lucide-react";
import { useContext } from "react";
import { useParams } from "react-router-dom";

function Toolbar() {
  const sidebarContext = useContext(SidebarContext);

  const params = useParams();
  const pageQuery = usePageQuery(params.pageId ?? "");

  return (
    <div
      id="editor-toolbar"
      className="inline-flex h-12 w-full select-none items-center gap-2 border-b border-border bg-background px-2 text-foreground"
    >
      {!sidebarContext.isSidebarOpen && (
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={sidebarContext.toggleSidebarOpen}
          className="flex-shrink-0"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </Button>
      )}

      {pageQuery.isError && <div className="mx-2">Error</div>}

      {pageQuery.data && (
        <Button variant={"ghost"} size={"default"} className="justify-start">
          <span className="line-clamp-1 text-start">
            {pageQuery.data.pageName}
          </span>
        </Button>
      )}

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
