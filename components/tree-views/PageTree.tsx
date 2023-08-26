import React, { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  Tree,
  InteractionMode,
  TreeRef,
  TreeItemIndex,
  ControlledTreeEnvironment,
  InteractionManager,
} from "react-complex-tree";

import {
  ItemArrow,
  ItemTitle,
  ItemsContainer,
  RenameInput,
  TreeContainer,
} from "./TreeItemElements";
import TreeItem from "./TreeItem";

import {
  usePageQuery,
  usePageListQuery,
  useUpdatePageMutation,
} from "@/hooks/pageQueryHooks";
import { useTreeData } from "@/hooks/useTreeData";
import useParentPageIds from "@/hooks/useParentPageIds";

import "react-complex-tree/lib/style-modern.css";

const customInteractionMode: InteractionManager = {
  mode: "custom",
  extends: InteractionMode.ClickArrowToExpand,
  createInteractiveElementProps: (item, treeId, actions, renderFlags) => {
    return {
      onClick: (e) => {
        e.stopPropagation();
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
          // actions.selectItem();
          actions.primaryAction();
        }
      },
    };
  },
};

const PageTree: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pageQuery = usePageQuery(router.query.pageId as string);

  const updatePageMutation = useUpdatePageMutation(queryClient);

  const treeData = useTreeData();
  const parentPageIds = useParentPageIds(
    pageQuery.data ? pageQuery.data.id : ""
  );

  const [focusedItem, setFocusedItem] = useState<TreeItemIndex>("");
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);

  const [isRenaming, setIsRenaming] = useState(false);
  const [pageToRename, setPageToRename] = useState<TreeItemIndex>("");

  const mainTreeRef = useRef<TreeRef>(null);

  // Automatically expand the parents of the current page
  useEffect(() => {
    if (!parentPageIds) return;
    setExpandedItems((prev) => [...prev, ...parentPageIds]);
  }, [parentPageIds]);

  // This effect is required to make React Complex Tree handle focus management
  // on rename input when rename action is initiated from context menu
  useEffect(() => {
    if (!mainTreeRef.current || !isRenaming || !pageToRename) return;
    mainTreeRef.current.startRenamingItem(pageToRename);
  }, [isRenaming, pageToRename]);

  return (
    <>
      {treeData && (
        <ControlledTreeEnvironment
          items={treeData.items}
          getItemTitle={(item) => item.data.pageName}
          viewState={{
            ["mainTree"]: { focusedItem, expandedItems, selectedItems },
          }}
          canDragAndDrop={true}
          canDropOnFolder={true}
          canReorderItems={false}
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
            setIsRenaming(true);
            updatePageMutation.mutate({
              id: item.index.toString(),
              pageName: newName,
            });
            setIsRenaming(false);
          }}
          onAbortRenamingItem={() => setIsRenaming(false)}
          onPrimaryAction={(item) => router.push(`/${item.index}`)}
          onDrop={(items, target) => {
            items.forEach((item) => {
              if (target.targetType === "item") {
                updatePageMutation.mutate({
                  id: item.index.toString(),
                  parentId: target.targetItem.toString(),
                });
              }
            });
          }}
          renderDepthOffset={16}
          renderItemTitle={(props) => <ItemTitle {...props} />}
          renderItemArrow={(props) => <ItemArrow {...props} />}
          renderItemsContainer={(props) => <ItemsContainer {...props} />}
          renderTreeContainer={(props) => <TreeContainer {...props} />}
          renderRenameInput={(props) => <RenameInput {...props} />}
          renderItem={(props) => (
            <TreeItem
              {...props}
              expandedItems={expandedItems}
              selectedItems={selectedItems}
              setExpandedItems={setExpandedItems}
              setSelectedItems={setSelectedItems}
              setIsRenaming={setIsRenaming}
              setPageToRename={setPageToRename}
            />
          )}
        >
          <Tree
            treeId="mainTree"
            rootItem="root"
            treeLabel="Page Tree"
            ref={mainTreeRef}
          />
        </ControlledTreeEnvironment>
      )}
    </>
  );
};

export default PageTree;
