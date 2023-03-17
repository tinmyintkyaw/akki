import { ReactNode } from "react";
import {
  HiBars3,
  HiEllipsisHorizontal,
  HiMagnifyingGlass,
} from "react-icons/hi2";
import { MdMenu, MdMoreHoriz, MdSearch } from "react-icons/md";

type EditorToolbarProps = {
  sidebarTrigger: ReactNode;
};

export default function EditorToolbar(props: EditorToolbarProps) {
  return (
    <div
      id="editor-toolbar"
      className="absolute z-40 flex h-12 w-full select-none items-center gap-2 bg-transparent px-4 text-stone-700"
    >
      {props.sidebarTrigger}
      <MdSearch className="h-6 w-5" />
      <div className="flex-grow" />
      <MdMoreHoriz className="h-6 w-5" />
    </div>
  );
}
