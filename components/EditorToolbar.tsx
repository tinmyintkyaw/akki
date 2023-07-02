import { useEffect } from "react";
import { useInstantSearch } from "react-instantsearch-hooks-web";
import * as Avatar from "@radix-ui/react-avatar";

import ToolbarButton from "@/components/ToolbarButton";
import ToolbarDropdown from "@/components/ToolbarDropdown";
import SearchComboBox from "@/components/SearchComboBox";
import useSearchAPIKey from "@/hooks/useSearchAPIKey";
import { MdMenu, MdMoreHoriz, MdSearch, MdStar } from "react-icons/md";
import ProfileDropdown from "./ProfileDropdown";
import { useSession } from "next-auth/react";

type EditorToolbarProps = {
  setIsOpen: () => void;
};

export default function EditorToolbar(props: EditorToolbarProps) {
  const { status, error } = useInstantSearch({ catchError: true });
  const session = useSession();

  const searchAPIKey = useSearchAPIKey();

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
      className="absolute z-40 flex h-12 w-full select-none items-center gap-2 bg-transparent px-2 text-stone-700"
    >
      <ToolbarButton icon={MdMenu} onClick={props.setIsOpen} />

      <SearchComboBox>
        <ToolbarButton icon={MdSearch} />
      </SearchComboBox>

      <div className="flex-grow" />

      <ProfileDropdown />

      <ToolbarDropdown>
        <ToolbarButton icon={MdMoreHoriz} />
      </ToolbarDropdown>
    </div>
  );
}
