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
import useFavouritesTreeData from "@/hooks/useFavouritesData";

import "react-complex-tree/lib/style-modern.css";
import {
  ItemArrow,
  ItemTitle,
  ItemsContainer,
  RenameInput,
  TreeContainer,
} from "./TreeItemElements";
import TreeItem from "./TreeItem";

const FavouritesTree: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pageQuery = usePageQuery(router.query.pageId as string);

  const updatePageMutation = useUpdatePageMutation(queryClient);

  const favTreeData = useFavouritesTreeData();

  const [focusedItem, setFocusedItem] = useState<TreeItemIndex>("");
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);

  const [isRenaming, setIsRenaming] = useState(false);
  const [pageToRename, setPageToRename] = useState<TreeItemIndex>("");

  const favTreeRef = useRef<TreeRef>(null);

  // Automatically expand the collection current page is in
  useEffect(() => {
    if (pageQuery.isLoading || pageQuery.isError) return;
    setExpandedItems((prev) => [...prev, pageQuery.data.collectionId]);
  }, [pageQuery.data, pageQuery.isError, pageQuery.isLoading]);

  // This effect is required to make React Complex Tree handle focus management
  // on rename input when rename action is initiated from context menu
  useEffect(() => {
    if (!favTreeRef.current || !isRenaming || !pageToRename) return;
    favTreeRef.current.startRenamingItem(pageToRename);
  }, [isRenaming, pageToRename]);

  return (
    <>
      {favTreeData && (
        <ControlledTreeEnvironment
          items={favTreeData.items}
          getItemTitle={(item) =>
            item.isFolder ? item.data.collectionName : item.data.pageName
          }
          viewState={{
            ["favTree"]: { focusedItem, expandedItems, selectedItems },
          }}
          canDragAndDrop={false}
          canSearch={false}
          canRename={true}
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
          onPrimaryAction={(item) => router.push(`/${item.index}`)}
          renderDepthOffset={32}
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
            treeId="favTree"
            rootItem="root"
            treeLabel="Favourited Items Tree"
            ref={favTreeRef}
          />
        </ControlledTreeEnvironment>
      )}
    </>
  );
};

export default FavouritesTree;
