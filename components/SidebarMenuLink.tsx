import {
  useCreatePageMutation,
  useDeletePageMutation,
  usePageQuery,
  useUpdatePageMutation,
} from "@/hooks/queryHooks";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { IconType } from "react-icons";
import * as RadixContextMenu from "@radix-ui/react-context-menu";
import MenuButton from "@/components/MenuButton";
import clsx from "clsx";
import { RxFilePlus, RxStar, RxTrash } from "react-icons/rx";
import { HiEllipsisHorizontal, HiPlus } from "react-icons/hi2";

import { inter } from "@/pages/_app";

import SidebarItemDropdown from "@/components/SidebarItemDropdown";

type SidebarMenuLinkProps = {
  pageId: string;
  parentPageId: string | null;
  text: string;
  icon: IconType;
  isOpen: boolean;
};

const SidebarMenuLink = (props: SidebarMenuLinkProps) => {
  const queryClient = useQueryClient();

  const createPageMutation = useCreatePageMutation(
    "Untitled",
    props.pageId,
    queryClient
  );

  const deletePageMutation = useDeletePageMutation(props.pageId, queryClient);

  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger asChild>
        <div
          className={clsx(
            props.isOpen && "bg-stone-200",
            "group flex h-8 items-center rounded-sm pl-3 pr-2 hover:bg-stone-300"
          )}
        >
          <Link
            href={`/page/${props.pageId}`}
            className="flex h-full flex-grow items-center gap-2"
          >
            {props.icon && <props.icon className="h-4 w-4 min-w-[1rem]" />}

            <p className="line flex-grow line-clamp-1">{props.text}</p>
          </Link>

          <button
            onClick={() => createPageMutation.mutate()}
            className="rounded-sm p-1 opacity-0 hover:bg-stone-200 focus:outline-none group-hover:opacity-100"
          >
            <HiPlus className="h-4 w-4" />
          </button>
        </div>
      </RadixContextMenu.Trigger>

      <RadixContextMenu.Portal>
        <RadixContextMenu.Content
          className={clsx(
            inter.className,
            "z-50 flex w-60 flex-col rounded border border-stone-200 bg-stone-50 p-1 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
          )}
        >
          <RadixContextMenu.Item asChild>
            <MenuButton
              icon={RxFilePlus}
              text="Add Child Page"
              onClick={() => createPageMutation.mutate()}
            />
          </RadixContextMenu.Item>

          <RadixContextMenu.Separator className="my-1 h-[1px] bg-stone-300" />

          <RadixContextMenu.Item asChild>
            <MenuButton
              icon={RxStar}
              text="Add To Favourites"
              onClick={() => {}}
            />
          </RadixContextMenu.Item>

          <RadixContextMenu.Item asChild>
            <MenuButton icon={RxFilePlus} text="Rename" onClick={() => {}} />
          </RadixContextMenu.Item>

          <RadixContextMenu.Item asChild>
            <MenuButton
              icon={RxTrash}
              text="Delete Page"
              onClick={() => deletePageMutation.mutate()}
            />
          </RadixContextMenu.Item>
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
};

export default SidebarMenuLink;
