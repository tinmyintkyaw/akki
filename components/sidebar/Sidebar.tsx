import { ReactNode, useState } from "react";
import { Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import ToolbarButton from "../ToolbarButton";
import { MdKeyboardDoubleArrowLeft, MdMenu } from "react-icons/md";

type SidebarProps = {
  pageListComponent: ReactNode;
  isOpen: boolean;
  setIsOpen: () => void;
};

export default function Sidebar(props: SidebarProps) {
  const [width, setWidth] = useState(72);

  const session = useSession();

  return (
    <Transition
      show={props.isOpen}
      id="sidebar"
      className="text-normal fixed z-10 flex h-screen w-screen select-none flex-col border-r-2 bg-zinc-50 font-normal text-slate-800 shadow-lg md:static md:w-full md:max-w-[20rem]"
      enter="transition ease-in-out duration-300"
      enterFrom="transform -translate-x-full"
      enterTo="transform translate-x-0"
      leave="transition ease-in-out duration-300"
      leaveFrom="transform translate-x-0"
      leaveTo="transform -translate-x-full"
    >
      {/* Sidebar Header */}
      <div className="flex h-12 flex-row items-center gap-2 px-2">
        <h1 className="ml-2 flex-grow text-xl font-medium">Project Potion</h1>

        {props.isOpen && (
          <ToolbarButton
            icon={MdKeyboardDoubleArrowLeft}
            onClick={props.setIsOpen}
          />
        )}
      </div>

      {props.pageListComponent}
    </Transition>
  );
}
