import Image from "next/image";
import { useSession } from "next-auth/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import {
  HiOutlineDocumentText,
  HiOutlineMagnifyingGlass,
  HiOutlineCog6Tooth,
  HiOutlineDocumentPlus,
  HiOutlineFolderPlus,
  HiOutlineTrash,
} from "react-icons/hi2";
import { IconType } from "react-icons";

function SidebarMenuItem(props: { text: string; icon?: IconType }) {
  return (
    <a
      href="#"
      className="flex h-7 w-full items-center gap-2 px-4 hover:bg-slate-200"
    >
      {props.icon && <props.icon className="h-4 w-4" />}
      <p className="line-clamp-1">{props.text}</p>
    </a>
  );
}

const sampleDocuments = [
  "Meeting Notes",
  "Project Proposal",
  "Conference Agenda",
  "Budget Spreadsheet",
  "Marketing Plan",
  "Research Report",
  "Training Manual",
  "Client Contract",
  "Product Specs",
  "Employee Handbook",
  "Executive Summary",
  "Business Plan",
  "SWOT Analysis",
  "Case Study",
  "White Paper",
  "Press Release",
  "Sales Report",
  "Invoices",
  "Receipts",
  "Purchase Order",
  "Memos",
  "Meeting Minutes",
  "Agendas",
  "Performance Reviews",
  "Job Descriptions",
];

export default function Sidebar() {
  const session = useSession();

  return (
    <div
      id="sidebar"
      className="sticky top-0 h-screen w-72 select-none border-x bg-stone-50 text-sm text-slate-700"
    >
      {/* Profile */}
      <button className="flex h-12 w-full items-center gap-2 border-b-2 px-4 hover:bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={session.data?.user?.image}
          alt="User Profile Picture"
          className="h-6 w-6 rounded-full"
        />
        <p className="font-medium">{session.data?.user?.name}</p>
      </button>

      <div className="border-b-2 py-2">
        <SidebarMenuItem text="Search" icon={HiOutlineMagnifyingGlass} />
        <SidebarMenuItem text="New Document" icon={HiOutlineDocumentPlus} />
        <SidebarMenuItem text="Settings" icon={HiOutlineCog6Tooth} />
      </div>

      <ScrollArea.Root type="hover">
        <ScrollArea.Viewport className="h-[calc(100dvh-12.5rem)] w-full">
          <h2 className="px-4 py-2 text-xs font-semibold">Documents</h2>
          {sampleDocuments.map((document) => (
            <SidebarMenuItem
              key={document}
              text={document}
              icon={HiOutlineDocumentText}
            />
          ))}
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb className="min-w-[0.5rem] bg-stone-300" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      <button className="flex h-12 w-full items-center gap-2 border-t px-4 hover:bg-stone-200">
        <HiOutlineTrash className="h-4 w-4" />
        <p>Trash</p>
      </button>
    </div>
  );
}
