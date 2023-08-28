import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import clsx from "clsx";
import {
  TreeItem,
  TreeItemIndex,
  TreeItemRenderContext,
} from "react-complex-tree";

import { FileEdit, Plus, Star, StarOff, Trash2 } from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import {
  useCreatePageMutation,
  useDeletePageMutation,
  useUpdatePageMutation,
} from "@/hooks/pageQueryHooks";

interface ItemProps {
  item: TreeItem;
  depth: number;
  children: React.ReactNode | null;
  title: React.ReactNode;
  arrow: React.ReactNode;
  context: TreeItemRenderContext;
  selectedItems: TreeItemIndex[];
  setSelectedItems: React.Dispatch<React.SetStateAction<TreeItemIndex[]>>;
  expandedItems: TreeItemIndex[];
  setExpandedItems: React.Dispatch<React.SetStateAction<TreeItemIndex[]>>;
  setIsRenaming: React.Dispatch<React.SetStateAction<boolean>>;
  setPageToRename: React.Dispatch<React.SetStateAction<TreeItemIndex>>;
}

import { useAutoAnimate } from "@formkit/auto-animate/react";

const TreeItem: React.FC<ItemProps> = (props) => {
  const {
    arrow,
    children,
    context,
    title,
    item,
    depth,
    selectedItems,
    setExpandedItems,
    setIsRenaming,
    setPageToRename,
  } = props;

  const router = useRouter();
  const queryClient = useQueryClient();
  const createPageMutation = useCreatePageMutation(queryClient);
  const updatePageMutation = useUpdatePageMutation(queryClient);
  const deletePageMutation = useDeletePageMutation(queryClient);

  const InteractiveComponent = context.isRenaming ? "div" : "button";
  const type = context.isRenaming ? undefined : "button";

  const [parent] = useAutoAnimate();

  return (
    <ContextMenu>
      <li
        {...context.itemContainerWithChildrenProps}
        ref={parent}
        className="flex flex-col"
      >
        <ContextMenuTrigger asChild>
          <div
            {...(context.itemContainerWithoutChildrenProps as any)}
            className="h-[37px]"
          >
            <InteractiveComponent
              type={type}
              {...(context.interactiveElementProps as any)}
              className={clsx(
                "group inline-flex h-9 w-full items-center justify-center rounded text-sm outline-2 -outline-offset-1 outline-ring transition-colors focus-visible:outline radix-state-open:bg-accent hover:bg-accent",
                // context.isSelected && "outline outline-2 outline-ring",
                context.isDraggingOver && "bg-sky-700",
                item.index === router.query.pageId && "bg-accent"
              )}
              style={{ paddingLeft: depth * 16 }}
            >
              {item.isFolder ? arrow : <div className="h-9 w-3" />}

              {title}

              {!context.isRenaming && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    createPageMutation.mutate({
                      pageName: "Untitled",
                      parentId: item.index.toString(),
                    });
                    setExpandedItems((prev) => [
                      ...prev,
                      item.index.toString(),
                    ]);
                  }}
                  className="ml-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded text-accent-foreground opacity-0 group-hover:opacity-100 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                  <Plus className="h-4 w-4" />
                </div>
              )}
            </InteractiveComponent>
          </div>
        </ContextMenuTrigger>

        {children}
      </li>

      <ContextMenuContent className="w-56">
        <ContextMenuItem
          onClick={() => {
            createPageMutation.mutate(
              {
                pageName: "Untitled",
                parentId: item.index.toString(),
              },
              {
                onSuccess(data) {
                  const { parentId } = data;
                  if (!parentId) return;
                  setExpandedItems((prev) => [...prev, parentId]);
                },
              }
            );
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="leading-4">Add Page</span>
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            updatePageMutation.mutate({
              id: item.index.toString(),
              isFavourite: !item.data.isFavourite,
            });
          }}
        >
          {item.data.isFavourite ? (
            <StarOff className="mr-2 h-4 w-4" />
          ) : (
            <Star className="mr-2 h-4 w-4" />
          )}
          <span className="leading-4">
            {item.data.isFavourite
              ? "Remove from favourites"
              : "Add to favourites"}
          </span>
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            setIsRenaming(true);
            setPageToRename(item.index.toString());
          }}
        >
          <FileEdit className="mr-2 h-4 w-4" />
          <span className="leading-4">Rename</span>
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            deletePageMutation.mutate({ id: item.index.toString() });
            // TODO: push to most recent page
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span className="leading-4">Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TreeItem;
