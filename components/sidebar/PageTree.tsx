import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  useCreatePageMutation,
  useDeletePageMutation,
  usePageListQuery,
  useUpdatePageMutation,
} from "@/hooks/queryHooks";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import {
  Check,
  ChevronDown,
  FileEdit,
  FileText,
  Plus,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  Tree,
  InteractionMode,
  TreeRef,
  TreeItemIndex,
  ControlledTreeEnvironment,
  AllTreeRenderProps,
  InteractionManager,
} from "react-complex-tree";

// import "react-complex-tree/lib/style-modern.css";

interface updatePagePayloadInterface {
  id: string;
  pageName?: string;
  parentPageId?: string;
  isFavourite?: boolean;
}

interface createPagePayloadInterface {
  pageName: string;
  parentPageId?: string | null;
}

interface PageTreeProps {
  currentlyOpenPage: string;
}

const PageTree: React.FC<PageTreeProps> = (props) => {
  const { currentlyOpenPage } = props;

  const [treeData, setTreeData] = useState(null);
  const [focusedItem, setFocusedItem] = useState<TreeItemIndex>("");
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);

  const [isRenaming, setIsRenaming] = useState(false);
  const [pageToRename, setPageToRename] = useState<TreeItemIndex>("");
  const [pageToDelete, setPageToDelete] = useState<TreeItemIndex>("");

  const [updatePagePayload, setUpdatePagePayload] =
    useState<updatePagePayloadInterface>({ id: "" });

  const [createPagePayload, setCreatePagePayload] =
    useState<createPagePayloadInterface>({
      pageName: "Untitled",
      parentPageId: null,
    });

  const treeRef = useRef<TreeRef>(null);

  const router = useRouter();
  const queryClient = useQueryClient();
  const pageListQuery = usePageListQuery();

  const updatePageMutation = useUpdatePageMutation(
    {
      id: updatePagePayload.id,
      pageName: updatePagePayload.pageName
        ? updatePagePayload.pageName
        : "Untitled",
      parentPageId: updatePagePayload.parentPageId,
      isFavourite: updatePagePayload.isFavourite,
    },
    queryClient
  );

  const createPageMutation = useCreatePageMutation(
    {
      pageName: "Untitled",
      parentPageId:
        createPagePayload.parentPageId !== undefined
          ? createPagePayload.parentPageId
          : null,
    },
    queryClient
  );

  const deletePageMutation = useDeletePageMutation(
    pageToDelete.toString(),
    queryClient
  );

  useEffect(() => {
    if (!treeRef.current || !isRenaming || !pageToRename) return;
    treeRef.current.startRenamingItem(pageToRename);
  }, [isRenaming, pageToRename]);

  useEffect(() => {
    if (pageListQuery.isLoading || pageListQuery.isError) return;

    // Transform data into format readable by tree view library at the client
    const pageTree = pageListQuery.data.reduce((acc: any, cur, i, arr) => {
      const { id, childPages, ...stripped } = cur;
      acc[cur.id] = {
        index: cur.id,
        children: cur.childPages.map((page) => page.id),
        isFolder: true,
        data: stripped,
      };

      return acc;
    }, {});

    const topLevelPages = pageListQuery.data.filter(
      (page) => page.parentPageId === null
    );
    const topLevelPageIds = topLevelPages.map((page) => page.id);

    const pageTreeWithRoot = {
      root: { index: "root", children: topLevelPageIds },
      ...pageTree,
    };

    setTreeData(pageTreeWithRoot);

    const folderMap = new Map(
      pageListQuery.data.map((page) => [page.id, page])
    );

    // get an array with parent pages of a specific page
    const getParents = (page) => {
      if (page.parentPageId) {
        return getParents(folderMap.get(page.parentPageId)).concat(page.id);
      } else {
        return [page.id];
      }
    };

    const parentPages = getParents(folderMap.get(currentlyOpenPage));

    setExpandedItems((prev) => [...prev, ...parentPages]);
  }, [
    currentlyOpenPage,
    pageListQuery.data,
    pageListQuery.isError,
    pageListQuery.isLoading,
  ]);

  const renderItemTitle: AllTreeRenderProps["renderItemTitle"] = ({
    title,
  }) => <span className="line-clamp-1 flex-grow text-start">{title}</span>;

  const renderItemArrow: AllTreeRenderProps["renderItemArrow"] = ({
    context,
  }) => (
    <div
      {...context.arrowProps}
      onClick={(e) => {
        // Prevent clicking the arrow from triggering primary action
        e.stopPropagation();
        context.toggleExpandedState();
      }}
      className="h-8 w-8 rounded p-2 hover:bg-neutral-700"
    >
      <ChevronDown
        className={clsx("h-4 w-4", context.isExpanded && "rotate-180")}
      />
    </div>
  );

  const renderItem: AllTreeRenderProps["renderItem"] = (props) => {
    const { arrow, children, context, title, item, info } = props;
    const InteractiveComponent = context.isRenaming ? "div" : "button";
    const type = context.isRenaming ? undefined : "button";

    return (
      <ContextMenu>
        <li
          {...context.itemContainerWithChildrenProps}
          className="flex flex-col"
        >
          <ContextMenuTrigger asChild>
            <InteractiveComponent
              type={type}
              href={`localhost:3000/${item.index}`}
              {...(context.itemContainerWithoutChildrenProps as any)}
              {...(context.interactiveElementProps as any)}
              className={clsx(
                "group my-[2px] inline-flex h-8 w-full items-center justify-center rounded text-sm outline-2 outline-sky-700 focus-visible:outline",
                context.isSelected && selectedItems.length > 1
                  ? "bg-sky-700"
                  : "hover:bg-accent",
                context.isDraggingOver && "bg-sky-700",
                item.index && item.index === currentlyOpenPage && "bg-accent"
              )}
            >
              {arrow}
              <FileText className="mr-2 h-4 w-4" />
              {title}
              {!context.isRenaming && (
                <div className="ml-1 h-8 w-8 rounded p-2 opacity-0 group-hover:opacity-100 hover:bg-neutral-700">
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
              setCreatePagePayload({
                pageName: "Untitled",
                parentPageId: item.index.toString(),
              });
              createPageMutation.mutate();
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Nested Page</span>
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() => {
              setUpdatePagePayload({
                id: item.index.toString(),
                isFavourite: !item.data.isFavourite,
              });
              updatePageMutation.mutate();
            }}
          >
            {item.data.isFavourite ? (
              <StarOff className="mr-2 h-4 w-4" />
            ) : (
              <Star className="mr-2 h-4 w-4" />
            )}
            <span>
              {item.data.isFavourite
                ? "Remove from favourites"
                : "Add to favourites"}
            </span>
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() => {
              setIsRenaming(true);
              setPageToRename(props.item.index);
            }}
          >
            <FileEdit className="mr-2 h-4 w-4" />
            <span>Rename</span>
          </ContextMenuItem>

          <ContextMenuItem
            onClick={() => {
              setPageToDelete(item.index.toString());
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

  const renderTreeContainer: AllTreeRenderProps["renderTreeContainer"] = (
    props
  ) => {
    const { children, containerProps } = props;
    return <div {...containerProps}>{children}</div>;
  };

  const renderItemsContainer: AllTreeRenderProps["renderItemsContainer"] = (
    props
  ) => {
    const { children, containerProps, depth } = props;
    return (
      <ul {...containerProps} className={clsx(depth === 0 ? "pl-0" : "pl-4")}>
        {children}
      </ul>
    );
  };

  const renderRenameInput: AllTreeRenderProps["renderRenameInput"] = (
    props
  ) => {
    const {
      formProps,
      inputProps,
      inputRef,
      submitButtonProps,
      submitButtonRef,
    } = props;

    return (
      <form {...formProps} className="flex flex-grow">
        <input
          {...inputProps}
          ref={inputRef}
          autoFocus
          className="flex-grow bg-inherit outline-none"
        />

        <button
          {...submitButtonProps}
          ref={submitButtonRef}
          type="submit"
          className="h-8 w-8 rounded p-2 hover:bg-neutral-700"
        >
          <Check className="h-4 w-4" />
        </button>
      </form>
    );
  };

  const customInteractionMode: InteractionManager = {
    mode: "custom",
    extends: InteractionMode.ClickArrowToExpand,
    createInteractiveElementProps: (item, treeId, actions, renderFlags) => {
      return {
        onClick: (e) => {
          actions.focusItem();
          if (e.shiftKey) {
            actions.selectUpTo(!e.ctrlKey);
          } else if (e.ctrlKey || e.metaKey) {
            if (renderFlags.isSelected) {
              actions.unselectItem();
            } else {
              actions.addToSelectedItems();
            }
          } else {
            actions.selectItem();
            actions.primaryAction();
          }
        },
      };
    },
  };

  return (
    <>
      {!pageListQuery.isLoading || (!pageListQuery.isError && <p>Loading</p>)}
      {treeData && (
        <ControlledTreeEnvironment
          items={treeData}
          getItemTitle={(item) => item.data.pageName}
          viewState={{
            ["controlledTree"]: { focusedItem, expandedItems, selectedItems },
          }}
          canDragAndDrop={true}
          canDropOnFolder={true}
          canRename={true}
          canSearch={false}
          defaultInteractionMode={customInteractionMode}
          onFocusItem={(item) => setFocusedItem(item.index)}
          onExpandItem={(item) =>
            setExpandedItems([...expandedItems, item.index])
          }
          onCollapseItem={(item) =>
            setExpandedItems(
              expandedItems.filter(
                (expandedItemIndex) => expandedItemIndex !== item.index
              )
            )
          }
          onSelectItems={(items) => {
            setSelectedItems(items);
          }}
          onRenameItem={(item, newName) => {
            setUpdatePagePayload({
              id: item.index.toString(),
              pageName: newName,
            });
            updatePageMutation.mutate();
          }}
          onPrimaryAction={(item) => router.push(`/${item.index}`)}
          onDrop={(items, target) => {
            if (target.targetType !== "item") return;
            items.forEach((item) => {
              setUpdatePagePayload({
                id: item.index.toString(),
                parentPageId: target.targetItem.toString(),
              });
              updatePageMutation.mutate();
            });
          }}
          renderDepthOffset={16}
          renderItemTitle={renderItemTitle}
          renderItemArrow={renderItemArrow}
          renderItem={renderItem}
          renderItemsContainer={renderItemsContainer}
          renderTreeContainer={renderTreeContainer}
          renderRenameInput={renderRenameInput}
        >
          <Tree
            treeId="controlledTree"
            rootItem="root"
            treeLabel="Page Tree"
            ref={treeRef}
          />
        </ControlledTreeEnvironment>
      )}
    </>
  );
};

export default PageTree;
