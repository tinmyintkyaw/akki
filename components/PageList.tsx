import * as ScrollArea from "@radix-ui/react-scroll-area";
import { HiOutlineDocumentText } from "react-icons/hi2";

import { SidebarMenuLink } from "./SidebarMenuItem";

// Only for testing purposes, will be removed later
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

export default function PageList() {
  return (
    <ScrollArea.Root type="hover">
      <ScrollArea.Viewport
        className="h-[calc(100dvh-12.5rem)] w-full"
        // className="h-screen w-full"
      >
        <h2 className="px-4 py-2 text-xs font-semibold">Pages</h2>
        {sampleDocuments.map((document) => (
          <SidebarMenuLink
            key={document}
            text={document}
            icon={HiOutlineDocumentText}
            href="#"
          />
        ))}
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb className="min-w-[0.5rem] bg-stone-300" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
