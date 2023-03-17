import * as ScrollArea from "@radix-ui/react-scroll-area";
import { HiOutlineDocumentText } from "react-icons/hi2";

import SidebarMenuLink from "./SidebarMenuLink";

type PageListProps = {
  pageList: [any]; // TODO: Add type for page & page list
};

export default function PageList(props: PageListProps) {
  return (
    <ScrollArea.Root type="hover">
      <ScrollArea.Viewport className="h-[calc(100vh-6rem)] border-stone-300 pl-2 pr-4">
        <h2 className="px-2 py-2 text-xs font-semibold">Pages</h2>

        {props.pageList.map((page) => (
          <SidebarMenuLink
            key={page.id}
            text={page.pageName}
            icon={HiOutlineDocumentText}
            href={`/${page.id}`}
          />
        ))}
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb className="min-w-[0.5rem] bg-stone-300" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
