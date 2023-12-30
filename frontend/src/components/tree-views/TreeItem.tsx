/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  useCreatePageMutation,
  useDeletePageMutation,
  useUpdatePageMutation,
} from "@/hooks/pageQueryHooks";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { FileEdit, Plus, Star, StarOff, Trash2 } from "lucide-react";
import {
  TreeItem,
  TreeItemIndex,
  TreeItemRenderContext,
} from "react-complex-tree";
import { useParams } from "react-router-dom";

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

const TreeItem: React.FC<ItemProps> = (props) => {
  const {
    arrow,
    children,
    context,
    title,
    item,
    depth,
    setExpandedItems,
    setIsRenaming,
    setPageToRename,
  } = props;

  const params = useParams();
  const queryClient = useQueryClient();
  const createPageMutation = useCreatePageMutation(queryClient);
  const updatePageMutation = useUpdatePageMutation(queryClient);
  const deletePageMutation = useDeletePageMutation(queryClient);

  const InteractiveComponent = context.isRenaming ? "div" : "button";
  const type = context.isRenaming ? undefined : "button";

  return (
    <ContextMenu>
      <li {...context.itemContainerWithChildrenProps} className="flex flex-col">
        <ContextMenuTrigger
          {...(context.itemContainerWithoutChildrenProps as any)}
          className="h-[33px]"
        >
          <InteractiveComponent
            type={type}
            {...(context.interactiveElementProps as any)}
            className={clsx(
              "radix-state-open:bg-accent group inline-flex h-8 w-full items-center justify-center rounded text-sm outline-2 -outline-offset-1 outline-ring transition-colors hover:bg-accent focus-visible:outline",
              // context.isSelected && "outline outline-2 outline-ring",
              context.isDraggingOver && "bg-sky-700",
              item.index === params.pageId && "bg-accent",
            )}
            style={{ paddingLeft: depth * 16 }}
          >
            {item.isFolder ? arrow : <div className="h-8 w-3" />}

            {title}

            {!context.isRenaming && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  createPageMutation.mutate({
                    pageName: "Untitled",
                    parentId: item.index.toString(),
                  });
                  setExpandedItems((prev) => [...prev, item.index.toString()]);
                }}
                className="ml-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded text-accent-foreground opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600"
              >
                <Plus className="h-4 w-4" />
              </div>
            )}
          </InteractiveComponent>
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
              },
            );
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Add Page</span>
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            updatePageMutation.mutate({
              id: item.index.toString(),
              isStarred: !item.data.isStarred,
            });
          }}
        >
          {item.data.isStarred ? (
            <StarOff className="mr-2 h-4 w-4" />
          ) : (
            <Star className="mr-2 h-4 w-4" />
          )}
          <span>
            {item.data.isStarred
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
          <span>Rename</span>
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            deletePageMutation.mutate({ id: item.index.toString() });
            // TODO: push to most recent page
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TreeItem;
