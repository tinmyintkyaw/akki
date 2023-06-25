import { ReactNode, useState } from "react";
import { Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import ProfileDropdown from "../ProfileDropdown";

type SidebarProps = {
  pageListComponent: ReactNode;
  isOpen: boolean;
};

export default function Sidebar(props: SidebarProps) {
  const [width, setWidth] = useState(72);

  const session = useSession();

  return (
    <>
      <Transition
        show={props.isOpen}
        id="sidebar"
        className="text-normal fixed z-10 flex h-screen w-screen select-none flex-col border-r-2 bg-zinc-50 pt-12 font-normal text-slate-800 shadow-lg md:static md:w-full md:max-w-[20rem]"
        enter="transition ease-in-out duration-300"
        enterFrom="transform -translate-x-full"
        enterTo="transform translate-x-0"
        leave="transition ease-in-out duration-300"
        leaveFrom="transform translate-x-0"
        leaveTo="transform -translate-x-full"
      >
        {props.pageListComponent}

        <ProfileDropdown />
      </Transition>
    </>
  );
}
