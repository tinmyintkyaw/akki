import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  ControlledTreeEnvironment,
  Tree,
  TreeItemIndex,
  TreeRef,
} from "react-complex-tree";

import { usePageQuery, useUpdatePageMutation } from "@/hooks/pageQueryHooks";
import useFavouritesTreeData from "@/hooks/useFavouritesData";

import customInteractionMode from "@/components/tree-views/CustomInteractionMode";
import ItemArrow from "@/components/tree-views/ItemArrow";
import ItemRenameInput from "@/components/tree-views/ItemRenameInput";
import ItemTitle from "@/components/tree-views/ItemTitle";
import ItemsContainer from "@/components/tree-views/ItemsContainer";
import TreeContainer from "@/components/tree-views/TreeContainer";
import TreeItem from "@/components/tree-views/TreeItem";

import "react-complex-tree/lib/style-modern.css";

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

    const { parentId } = pageQuery.data;
    if (!parentId) return;

    setExpandedItems((prev) => [...prev, parentId]);
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
          getItemTitle={(item) => item.data.pageName}
          viewState={{
            ["favTree"]: { focusedItem, expandedItems, selectedItems },
          }}
          canDragAndDrop={false}
          canSearch={false}
          canRename={true}
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
          renderDepthOffset={32}
          renderItemTitle={(props) => <ItemTitle {...props} />}
          renderItemArrow={(props) => <ItemArrow {...props} />}
          renderItemsContainer={(props) => <ItemsContainer {...props} />}
          renderTreeContainer={(props) => <TreeContainer {...props} />}
          renderRenameInput={(props) => <ItemRenameInput {...props} />}
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
