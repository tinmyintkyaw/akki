import {
  useCreatePageMutation,
  useDeletePageMutation,
  usePageQuery,
  useRecentPagesQuery,
  useUpdatePageMutation,
} from "@/hooks/queryHooks";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { IconType } from "react-icons";
import * as RadixContextMenu from "@radix-ui/react-context-menu";
import MenuButton from "@/components/MenuButton";
import clsx from "clsx";

import {
  MdAdd,
  MdDeleteOutline,
  MdExpandLess,
  MdExpandMore,
  MdOutlineMode,
  MdStar,
  MdStarOutline,
} from "react-icons/md";

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
            props.isOpen ? "bg-stone-200 text-stone-950" : "text-stone-700",
            "group my-[0.125rem] flex h-8 items-center gap-1 rounded-sm px-1 text-sm hover:bg-stone-200"
          )}
        >
          <button
            className="rounded p-1 text-stone-800 hover:bg-stone-300"
            onClick={props.setIsCollasped}
          >
            {props.isCollapsed ? (
              <MdExpandMore className="h-4 w-4" />
            ) : (
              <MdExpandLess className="h-4 w-4" />
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
            className="rounded p-1 text-stone-700 opacity-0 focus:outline-none group-hover:opacity-100 hover:bg-stone-300"
          >
            <MdAdd className="h-4 w-4" />
          </button>
        </div>
      </RadixContextMenu.Trigger>

      <RadixContextMenu.Portal>
        <RadixContextMenu.Content
          className={clsx(
            "z-50 flex w-56 flex-col rounded border border-stone-200 bg-stone-50 p-1 text-sm shadow-md"
          )}
        >
          <RadixContextMenu.Item asChild>
            <MenuButton
              text="Add Nested Page"
              onClick={() => createPageMutation.mutate()}
            >
              <MdAdd className="h-4 w-4" />
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
                <MdStarOutline className="h-4 w-4" />
              ) : (
                <MdStar className="h-4 w-4" />
              )}
            </MenuButton>
          </RadixContextMenu.Item>

          <RadixContextMenu.Item asChild>
            <MenuButton text="Rename" onClick={() => {}}>
              <MdOutlineMode className="h-4 w-4" />
            </MenuButton>
          </RadixContextMenu.Item>

          <RadixContextMenu.Item asChild>
            <MenuButton
              text="Delete Page"
              onClick={() => {
                deletePageMutation.mutate();
              }}
            >
              <MdDeleteOutline className="h-4 w-4" />
            </MenuButton>
          </RadixContextMenu.Item>
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
};

export default SidebarMenuLink;
