import clsx from "clsx";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";

import { sourceSans } from "@/pages/_app";
import MenuButton from "@/components/MenuButton";
import { RxFilePlus, RxStar, RxTrash } from "react-icons/rx";
import { HiEllipsisHorizontal } from "react-icons/hi2";

type SidebarItemDropdownProps = {
  // trigger: React.ReactNode;
};

export default function SidebarItemDropdown(props: SidebarItemDropdownProps) {
  return (
    <RadixDropdown.Root>
      {/* <RadixDropdown.Trigger>{props.trigger}</RadixDropdown.Trigger> */}

      <RadixDropdown.Trigger asChild>
        <button className="rounded-sm p-[2px] opacity-0 hover:bg-stone-300 focus:outline-none group-hover:opacity-100">
          <HiEllipsisHorizontal className="h-4 w-4" />
        </button>
      </RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        <RadixDropdown.Content
          align="start"
          side="left"
          className={clsx(
            // sourceSans.className,
            "z-50 flex w-60 flex-col rounded border border-stone-200 bg-stone-50 p-1 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
          )}
        >
          <RadixDropdown.Item asChild>
            <MenuButton
              icon={RxStar}
              text="Add To Favourites"
              onClick={() => {}}
              key={"toggleFavourite"}
            />
          </RadixDropdown.Item>

          <RadixDropdown.Item asChild>
            <MenuButton
              icon={RxFilePlus}
              text="Rename"
              onClick={() => {}}
              key={"rename"}
            />
          </RadixDropdown.Item>

          <RadixDropdown.Item asChild>
            <MenuButton
              icon={RxTrash}
              text="Delete Page"
              onClick={() => {}}
              key={"deletePage"}
            />
          </RadixDropdown.Item>

          {/* <RadixDropdown.Separator className="my-1 h-[1px] bg-stone-300" /> */}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}
