import ToolbarButton from "@/components/ToolbarButton";
import ToolbarDropdown from "@/components/ToolbarDropdown";
import SearchComboBox from "@/components/SearchComboBox";
import { MdMenu, MdMoreHoriz, MdSearch, MdStar } from "react-icons/md";
import ProfileDropdown from "./ProfileDropdown";

type EditorToolbarProps = {
  setIsOpen: () => void;
};

export default function EditorToolbar(props: EditorToolbarProps) {
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
