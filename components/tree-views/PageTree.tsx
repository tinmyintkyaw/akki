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

import { usePageQuery, useUpdatePageMutation } from "@/hooks/pageQueryHooks";
import { useTreeData } from "@/hooks/useTreeData";

import "react-complex-tree/lib/style-modern.css";
import {
  ItemArrow,
  ItemTitle,
  ItemsContainer,
  RenameInput,
  TreeContainer,
} from "./TreeItemElements";
import TreeItem from "./TreeItem";

const PageTree: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pageQuery = usePageQuery(router.query.pageId as string);

  const updatePageMutation = useUpdatePageMutation(queryClient);

  const treeData = useTreeData();

  const [focusedItem, setFocusedItem] = useState<TreeItemIndex>("");
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);

  const [isRenaming, setIsRenaming] = useState(false);
  const [pageToRename, setPageToRename] = useState<TreeItemIndex>("");

  const treeRef = useRef<TreeRef>(null);

  // Automatically expand the collection current page is in
  useEffect(() => {
    if (pageQuery.isLoading || pageQuery.isError) return;
    setExpandedItems((prev) => [...prev, pageQuery.data.collectionId]);
  }, [pageQuery.data, pageQuery.isError, pageQuery.isLoading]);

  // This effect is required to make React Complex Tree handle focus management
  // on rename input when rename action is initiated from context menu
  useEffect(() => {
    if (!treeRef.current || !isRenaming || !pageToRename) return;
    treeRef.current.startRenamingItem(pageToRename);
  }, [isRenaming, pageToRename]);

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
      {treeData && pageQuery.data && (
        <ControlledTreeEnvironment
          items={treeData.items}
          getItemTitle={(item) =>
            item.isFolder ? item.data.collectionName : item.data.pageName
          }
          viewState={{
            ["controlledTree"]: { focusedItem, expandedItems, selectedItems },
          }}
          canDragAndDrop={true}
          canDropOnFolder={true}
          canRename={true}
          canSearch={false}
          canDropAt={(items, target) => {
            // Prevent dropping a collection onto another collection
            if (
              items.some((item) => item.isFolder) &&
              target.targetType === "item" &&
              target.parentItem === "root"
            ) {
              return false;
            } else {
              return true;
            }
          }}
          defaultInteractionMode={InteractionMode.ClickArrowToExpand}
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

            if (item.isFolder) {
              // ...Mutate Collection
            } else {
              updatePageMutation.mutate({
                id: item.index.toString(),
                pageName: newName,
              });
            }
            setIsRenaming(false);
          }}
          onAbortRenamingItem={() => setIsRenaming(false)}
          onPrimaryAction={(item) => {
            if (!item.isFolder) router.push(`/${item.index}`);
            return;
          }}
          onDrop={(items, target) => {
            items.forEach((item) => {
              if (target.targetType === "item") {
                // Do nothing if dropped onto it's own collection
                if (item.data.collectionId === target.targetItem) return;

                updatePageMutation.mutate({
                  id: item.index.toString(),
                  collectionId: target.targetItem.toString(),
                });
              }
            });
          }}
          renderDepthOffset={32}
          renderItemTitle={(props) => <ItemTitle {...props} />}
          renderItemArrow={(props) => <ItemArrow {...props} />}
          renderItemsContainer={(props) => <ItemsContainer {...props} />}
          renderTreeContainer={(props) => <TreeContainer {...props} />}
          renderRenameInput={(props) => <RenameInput {...props} />}
          renderItem={(props) => (
            <TreeItem
              {...props}
              openItem={pageQuery.data.id}
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
