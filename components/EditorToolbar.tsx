import ToolbarButton from "@/components/ToolbarButton";
import ToolbarDropdown from "@/components/ToolbarDropdown";
import SearchComboBox from "@/components/SearchComboBox";
import {
  MdKeyboardDoubleArrowRight,
  MdMenu,
  MdMoreHoriz,
  MdSearch,
  MdStar,
} from "react-icons/md";
import ProfileDropdown from "./ProfileDropdown";

type EditorToolbarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: () => void;
};

export default function EditorToolbar(props: EditorToolbarProps) {
  return (
    <div
      id="editor-toolbar"
      className="flex h-12 w-full select-none items-center gap-2 px-2 text-stone-700 drop-shadow-lg"
    >
      {!props.isSidebarOpen && (
        <ToolbarButton
          icon={MdKeyboardDoubleArrowRight}
          onClick={props.setIsSidebarOpen}
        />
      )}

      <div className="flex-grow" />

      <SearchComboBox>
        <ToolbarButton icon={MdSearch} />
      </SearchComboBox>

      <ToolbarDropdown>
        <ToolbarButton icon={MdMoreHoriz} />
      </ToolbarDropdown>

      <ProfileDropdown />
    </div>
  );
}
