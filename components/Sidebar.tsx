import Image from "next/image";
import { useSession } from "next-auth/react";

import {
  HiOutlineMagnifyingGlass,
  HiOutlineCog6Tooth,
  HiOutlineDocumentPlus,
} from "react-icons/hi2";

import { SidebarMenuButton } from "./SidebarMenuItem";
import PageList from "./PageList";
import Profile from "./Profile";

export default function Sidebar() {
  const session = useSession();

  return (
    <div
      id="sidebar"
      className="sticky top-0 hidden h-screen w-72 select-none border-r-2 bg-stone-50 text-sm text-slate-700 md:flex md:flex-col"
    >
      <a className="flex h-12 w-full items-center gap-2 border-b-2 px-4">
        <h1 className="text-lg font-medium">Documents</h1>
      </a>

      <div className="border-b-2 py-2">
        <SidebarMenuButton
          text="Search"
          icon={HiOutlineMagnifyingGlass}
          onclick={() => {}}
        />

        <SidebarMenuButton
          text="New Document"
          icon={HiOutlineDocumentPlus}
          onclick={() => {}}
        />

        <SidebarMenuButton
          text="Settings"
          icon={HiOutlineCog6Tooth}
          onclick={() => {}}
        />
      </div>

      <PageList />
      <Profile />
    </div>
  );
}
