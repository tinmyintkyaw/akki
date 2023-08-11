import { useRouter } from "next/router";
import { MoreHorizontal, PanelLeftOpen, Search } from "lucide-react";

import { usePageQuery } from "@/hooks/pageQueryHooks";

import ToolbarDropdown from "@/components/ToolbarDropdown";
import SearchComboBox from "@/components/SearchComboBox";
import { Button } from "./ui/button";

type EditorToolbarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: () => void;
};

export default function EditorToolbar(props: EditorToolbarProps) {
  const router = useRouter();
  const pageQuery = usePageQuery(router.query.pageId as string);

  return (
    <div
      id="editor-toolbar"
      className="flex h-12 w-full select-none items-center gap-2 border-b bg-background px-2 text-foreground shadow-lg"
    >
      {pageQuery.isLoading || (pageQuery.isError && <div>Loading</div>)}

      {pageQuery.data && (
        <div className="flex flex-row items-center">
          <Button variant={"link"} size={"default"} className="h-7">
            <span>{pageQuery.data.collectionName}</span>
          </Button>
          <span>/</span>
          <Button variant={"link"} size={"default"} className="h-7">
            <span>{pageQuery.data.pageName}</span>
          </Button>
        </div>
      )}

      {!props.isSidebarOpen && (
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={props.setIsSidebarOpen}
        >
          <PanelLeftOpen className="h-5 w-5" />
        </Button>
      )}

      <div className="flex-grow" />

      <SearchComboBox>
        <Button variant={"ghost"} size={"icon"}>
          <Search className="h-5 w-5" />
        </Button>
      </SearchComboBox>

      <ToolbarDropdown>
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </ToolbarDropdown>
    </div>
  );
}
