import clsx from "clsx";
import * as RadixContextMenu from "@radix-ui/react-context-menu";

import MenuButton from "@/components/MenuButton";
import { RxFilePlus, RxStar, RxTrash } from "react-icons/rx";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import SidebarMenuLink from "./SidebarMenuLink";

type SidebarItemDropdownProps = {
  trigger: React.ReactNode;
};

export default function SidebarItemContextMenu(
  props: SidebarItemDropdownProps
) {
  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger>{props.trigger}</RadixContextMenu.Trigger>

      <RadixContextMenu.Portal>
        <RadixContextMenu.Content
          className={clsx(
            "z-50 flex w-60 flex-col rounded border border-stone-200 bg-stone-50 p-1 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
          )}
        >
          <RadixContextMenu.Item asChild>
            <MenuButton
              icon={RxStar}
              text="Add To Favourites"
              onClick={() => {}}
              key={"toggleFavourite"}
            />
          </RadixContextMenu.Item>

          <RadixContextMenu.Item asChild>
            <MenuButton
              icon={RxFilePlus}
              text="Rename"
              onClick={() => {}}
              key={"rename"}
            />
          </RadixContextMenu.Item>

          <RadixContextMenu.Item asChild>
            <MenuButton
              icon={RxTrash}
              text="Delete Page"
              onClick={() => {}}
              key={"deletePage"}
            />
          </RadixContextMenu.Item>

          {/* <RadixDropdown.Separator className="my-1 h-[1px] bg-stone-300" /> */}
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
}
