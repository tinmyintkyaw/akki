import SearchComboBox from "@/components/search/SearchComboBox";
import ToolbarDropdown from "@/components/toolbar/ToolbarDropdown";
import { Button } from "@/components/ui/button";
import { SidebarContext } from "@/contexts/SidebarContext";
import { MoreHorizontal, PanelLeftOpen, Search } from "lucide-react";
import { useContext } from "react";

interface ToolbarProps {
  title: string;
}

function Toolbar(props: ToolbarProps) {
  const sidebarContext = useContext(SidebarContext);

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

      <Button variant={"ghost"} size={"default"} className="justify-start">
        <span className="line-clamp-1 text-start">{props.title}</span>
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
