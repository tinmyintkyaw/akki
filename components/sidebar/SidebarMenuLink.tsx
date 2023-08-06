import {
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
} from "@/hooks/pageQueryHooks";
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

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import MenuButton from "@/components/MenuButton";
import { Button } from "../ui/button";

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
    { pageName: "Untitled", parentPageId: props.pageId },
    queryClient
  );

  const toggleFavouriteMutation = useUpdatePageMutation(
    {
      id: props.pageId,
      isFavourite: !props.isFavourite,
    },
    queryClient
  );
  const deletePageMutation = useDeletePageMutation(props.pageId, queryClient);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
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
      </ContextMenuTrigger>

      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={() => createPageMutation.mutate()}>
          <Plus className="mr-2 h-4 w-4" />
          <span>Add Nested Page</span>
        </ContextMenuItem>

        <ContextMenuItem onClick={() => toggleFavouriteMutation.mutate()}>
          {props.isFavourite ? (
            <StarOff className="mr-2 h-4 w-4" />
          ) : (
            <Star className="mr-2 h-4 w-4" />
          )}
          <span>
            {props.isFavourite ? "Remove from favourites" : "Add to favourites"}
          </span>
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            deletePageMutation.mutate();
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default SidebarMenuLink;
