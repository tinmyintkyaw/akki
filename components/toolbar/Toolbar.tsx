import { useRouter } from "next/router";
import {
  History,
  Moon,
  MoreHorizontal,
  PanelLeftOpen,
  Search,
  Star,
} from "lucide-react";

import { usePageQuery } from "@/hooks/pageQueryHooks";

import { Button } from "../ui/button";
import ToolbarDropdown from "@/components/toolbar/ToolbarDropdown";
import SearchComboBox from "@/components/search/SearchComboBox";
import { FC, useContext } from "react";
import { SidebarContext } from "@/contexts/SidebarContext";
// import ProfileDropdown from "@/components/ProfileDropdown";

type EditorToolbarProps = {};

const Toolbar: FC<EditorToolbarProps> = () => {
  const router = useRouter();
  const pageQuery = usePageQuery(router.query.pageId as string);

  const sidebarContext = useContext(SidebarContext);

  return (
    <div
      id="editor-toolbar"
      className="inline-flex h-12 w-full select-none items-center gap-2 border-b bg-background px-2 text-foreground shadow"
    >
      {!sidebarContext.isSidebarOpen && (
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={sidebarContext.toggleSidebarOpen}
          className="h-9 w-9 flex-shrink-0"
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
        <Button
          variant={"ghost"}
          size={"icon"}
          className="h-9 w-9 flex-shrink-0"
        >
          <Search className="h-5 w-5" />
        </Button>
      </SearchComboBox>

      {/* <ProfileDropdown /> */}

      <ToolbarDropdown>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="h-9 w-9 flex-shrink-0"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </ToolbarDropdown>
    </div>
  );
};

export default Toolbar;
