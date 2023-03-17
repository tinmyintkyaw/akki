import { ReactNode } from "react";
import { Transition } from "@headlessui/react";

import { HiPlus } from "react-icons/hi2";

type SidebarProps = {
  pageListComponent: ReactNode;
  isOpen: boolean;
};

export default function Sidebar(props: SidebarProps) {
  return (
    <Transition
      show={props.isOpen}
      id="sidebar"
      className="fixed z-10 flex h-screen w-screen select-none flex-col border-r-2 bg-stone-100 pt-12 text-sm text-slate-700 shadow-lg md:static md:w-72"
      enter="transition ease-in-out duration-300"
      enterFrom="transform -translate-x-full"
      enterTo="transform translate-x-0"
      leave="transition ease-in-out duration-300"
      leaveFrom="transform translate-x-0"
      leaveTo="transform -translate-x-full"
    >
      {props.pageListComponent}

      <button className="flex h-12 w-full items-center gap-2 border-t border-stone-300 px-4 hover:bg-stone-300">
        <HiPlus className="h-4 w-4" />
        <p className="line-clamp-1">Add Page</p>
      </button>
    </Transition>
  );
}
