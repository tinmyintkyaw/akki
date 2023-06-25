import { useEffect, useState } from "react";
import { useInstantSearch } from "react-instantsearch-hooks-web";

import ToolbarButton from "@/components/ToolbarButton";
import ToolbarDropdown from "@/components/ToolbarDropdown";
import SearchComboBox from "@/components/SearchComboBox";
import useSearchAPIKey from "@/hooks/useSearchAPIKey";
import { MdMenu, MdMoreHoriz, MdSearch } from "react-icons/md";
import ProfileDropdown from "./ProfileDropdown";

type EditorToolbarProps = {
  setIsOpen: () => void;
};

export default function EditorToolbar(props: EditorToolbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { status, error } = useInstantSearch({ catchError: true });

  const searchAPIKey = useSearchAPIKey();

  useEffect(() => {
    function handleKeyDown(event: any) {
      if ((event.ctrlKey || event.metaKey) && event.key === "p") {
        event.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // If the search API key is not available or expired, refetch it
  useEffect(() => {
    if (status !== "error") return;
    if (!(error instanceof Error) || error.name !== "RequestUnauthorized")
      return;
    searchAPIKey.refetch();
  }, [status, error, searchAPIKey]);

  return (
    <div
      id="editor-toolbar"
      className="absolute z-40 flex h-12 w-full select-none items-center gap-1 bg-transparent px-2 text-stone-700"
    >
      <ToolbarButton icon={MdMenu} onClick={props.setIsOpen} />

      <ToolbarButton
        icon={MdSearch}
        onClick={() => {
          setIsSearchOpen(true);
        }}
      />

      <SearchComboBox isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />

      <div className="flex-grow" />

      <ToolbarDropdown>
        <ToolbarButton icon={MdMoreHoriz} />
      </ToolbarDropdown>
    </div>
  );
}
