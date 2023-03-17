import * as ScrollArea from "@radix-ui/react-scroll-area";
import { HiOutlineDocumentText } from "react-icons/hi2";

import { SidebarMenuLink } from "./SidebarMenuItem";

type PageListProps = {
  pageList: [any]; // TODO: Add type for page & page list
};

const documentNames = [
  "Resume",
  "Cover Letter",
  "Project Proposal",
  "Budget Plan",
  "Marketing Strategy",
  "Employee Handbook",
  "Product Specifications",
  "Sales Report",
  "Meeting Minutes",
  "Training Manual",
  "Contract Agreement",
  "Research Findings",
  "Financial Statement",
  "Inventory List",
  "Customer Survey Results",
  "User Manual",
  "Job Description",
  "Project Plan",
  "Policy Manual",
  "Press Release",
  "Annual Report",
  "Incident Report",
  "Performance Review Form",
  "Company Profile",
  "Marketing Plan",
  "Business Plan",
  "Business Proposal",
  "Business Letter",
];

export default function PageList(props: PageListProps) {
  return (
    <ScrollArea.Root type="hover">
      <ScrollArea.Viewport className="h-[calc(100vh-6rem)] w-full border-t-2 border-stone-300 pl-2 pr-4">
        <h2 className="px-4 py-2 text-xs font-semibold">Pages</h2>

        {/* {props.pageList.map((page) => (
          <SidebarMenuLink
            key={page.id}
            text={page.pageName}
            icon={HiOutlineDocumentText}
            href={`/${page.id}`}
          />
        ))} */}

        {documentNames.map((name) => (
          <SidebarMenuLink
            key={name}
            text={name}
            href={`/${name}`}
            icon={HiOutlineDocumentText}
          />
        ))}
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb className="min-w-[0.5rem] bg-stone-300" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
