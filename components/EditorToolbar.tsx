import ToolbarDropdown from "@/components/ToolbarDropdown";
import SearchComboBox from "@/components/SearchComboBox";
import { MoreHorizontal, PanelLeftOpen, Search } from "lucide-react";
import { Button } from "./ui/button";

type EditorToolbarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: () => void;
};

export default function EditorToolbar(props: EditorToolbarProps) {
  return (
    <div
      id="editor-toolbar"
      className="flex h-12 w-full select-none items-center gap-2 border-b bg-background px-2 text-foreground shadow-lg"
    >
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
