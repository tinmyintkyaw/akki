import customInteractionMode from "@/components/tree-views/CustomInteractionMode";
import ItemArrow from "@/components/tree-views/ItemArrow";
import ItemRenameInput from "@/components/tree-views/ItemRenameInput";
import ItemTitle from "@/components/tree-views/ItemTitle";
import ItemsContainer from "@/components/tree-views/ItemsContainer";
import TreeContainer from "@/components/tree-views/TreeContainer";
import TreeItem from "@/components/tree-views/TreeItem";
import { usePageQuery, useUpdatePageMutation } from "@/hooks/pageQueryHooks";
import { useTreeData } from "@/hooks/tree-view/useTreeData";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import {
  ControlledTreeEnvironment,
  Tree,
  TreeItemIndex,
  TreeRef,
} from "react-complex-tree";
import { useNavigate, useParams } from "react-router-dom";

import "react-complex-tree/lib/style-modern.css";

const PageTree: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();
  const pageQuery = usePageQuery(params.pageId ?? "");

  const updatePageMutation = useUpdatePageMutation(queryClient);

  const treeData = useTreeData();

  const [focusedItem, setFocusedItem] = useState<TreeItemIndex>("");
  const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
  const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);

  const [isRenaming, setIsRenaming] = useState(false);
  const [pageToRename, setPageToRename] = useState<TreeItemIndex>("");

  const mainTreeRef = useRef<TreeRef>(null);

  // Automatically expand the parents of the current page
  useEffect(() => {
    if (pageQuery.isLoading || pageQuery.isError || !pageQuery.data) return;
    const parentPageIds = pageQuery.data.path.split(".");
    setExpandedItems((prev) => [...prev, ...parentPageIds]);
  }, [pageQuery.data, pageQuery.isError, pageQuery.isLoading]);

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
                (expandedItemIndex) => expandedItemIndex !== item.index,
              ),
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
          onPrimaryAction={(item) => navigate(`/${item.index}`)}
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
              canAddPage={true}
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
