import { ReactNode } from "react";

import { HiPlus } from "react-icons/hi2";

type SidebarProps = {
  pageListComponent: ReactNode;
};

export default function Sidebar(props: SidebarProps) {
  return (
    <div
      id="sidebar"
      className="hidden h-screen w-72 select-none border-r-2 bg-stone-200 pt-12 text-sm text-slate-700 md:flex md:flex-col"
    >
      {props.pageListComponent}

      <button className="flex h-12 w-full items-center gap-2 border-t-2 border-stone-300 px-4 hover:bg-stone-300">
        <HiPlus className="h-4 w-4" />
        <p className="line-clamp-1">Add Page</p>
      </button>
    </div>
  );
}
