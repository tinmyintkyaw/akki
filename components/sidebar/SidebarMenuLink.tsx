import {
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
} from "@/hooks/queryHooks";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import * as RadixContextMenu from "@radix-ui/react-context-menu";
import { IconType } from "react-icons";
import clsx from "clsx";

import {
  ChevronDown,
  ChevronUp,
  Plus,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";

import MenuButton from "@/components/MenuButton";

type SidebarMenuLinkProps = {
  pageId: string;
  parentPageId: string | null;
  isFavourite: boolean;
  text: string;
  icon: IconType;
  isOpen: boolean;
  isCollapsed: boolean;
  setIsCollasped: () => void;
};

const SidebarMenuLink = (props: SidebarMenuLinkProps) => {
  const queryClient = useQueryClient();

  const createPageMutation = useCreatePageMutation(
    "Untitled",
    props.pageId,
    queryClient
  );

  const toggleFavouriteMutation = useUpdatePageMutation({
    id: props.pageId,
    isFavourite: !props.isFavourite,
    queryClient,
  });
  const deletePageMutation = useDeletePageMutation(props.pageId, queryClient);

  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger asChild>
        <div
          className={clsx(
            props.isOpen && "bg-accent font-medium",
            "group my-[0.125rem] flex h-8 items-center gap-1 rounded-sm px-1 text-sm hover:bg-accent"
          )}
        >
          <button
            className="rounded p-1 hover:bg-accent"
            onClick={props.setIsCollasped}
          >
            {props.isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>

          <Link
            href={`/${props.pageId}`}
            className="flex h-full flex-grow items-center gap-2"
          >
            {props.icon && <props.icon className="h-4 w-4 min-w-[1rem]" />}

            <p className="line-clamp-1 flex-grow">{props.text}</p>
          </Link>

          <button
            onClick={() => createPageMutation.mutate()}
            className="rounded p-1 opacity-0 focus:outline-none group-hover:opacity-100 hover:bg-accent"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </RadixContextMenu.Trigger>

      <RadixContextMenu.Portal>
        <RadixContextMenu.Content className="z-50 flex w-56 flex-col rounded border border-border bg-popover p-1 text-sm shadow-md">
          <RadixContextMenu.Item asChild>
            <MenuButton
              text="Add Nested Page"
              onClick={() => createPageMutation.mutate()}
            >
              <Plus className="h-4 w-4" />
            </MenuButton>
          </RadixContextMenu.Item>

          <RadixContextMenu.Separator className="my-1 h-[1px] bg-stone-300" />

          <RadixContextMenu.Item asChild>
            <MenuButton
              text={
                props.isFavourite
                  ? "Remove from favourites"
                  : "Add to favourites"
              }
              onClick={() => toggleFavouriteMutation.mutate()}
            >
              {props.isFavourite ? (
                <StarOff className="h-4 w-4" />
              ) : (
                <Star className="h-4 w-4" />
              )}
            </MenuButton>
          </RadixContextMenu.Item>

          <RadixContextMenu.Item asChild>
            <MenuButton
              text="Delete Page"
              onClick={() => {
                deletePageMutation.mutate();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </MenuButton>
          </RadixContextMenu.Item>
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
};

export default SidebarMenuLink;
