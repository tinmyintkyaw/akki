import { TreeItemIndex } from "react-complex-tree";
import { StateCreator } from "zustand";

export interface PageTreeSlice {
  pageTreeFocusedItem: TreeItemIndex;
  pageTreeExpandedItems: TreeItemIndex[];
  pageTreeSelectedItems: TreeItemIndex[];
  setPageTreeFocusedItem: (item: TreeItemIndex) => void;
  addPageTreeExpandedItems: (newItems: TreeItemIndex[]) => void;
  removePageTreeExpandedItems: (itemsToRemove: TreeItemIndex[]) => void;
  setPageTreeSelectedItems: (items: TreeItemIndex[]) => void;
}

export const pageTreeSlice: StateCreator<
  PageTreeSlice,
  [],
  [],
  PageTreeSlice
> = (set) => ({
  pageTreeFocusedItem: "",
  pageTreeExpandedItems: [],
  pageTreeSelectedItems: [],

  setPageTreeFocusedItem(item) {
    set(() => ({ pageTreeFocusedItem: item }));
  },

  addPageTreeExpandedItems(newItems) {
    set((state) => ({
      pageTreeExpandedItems: state.pageTreeExpandedItems.concat(newItems),
    }));
  },

  removePageTreeExpandedItems(itemsToRemove) {
    set((state) => ({
      pageTreeExpandedItems: state.pageTreeExpandedItems.filter(
        (item) => !itemsToRemove.includes(item),
      ),
    }));
  },

  setPageTreeSelectedItems(newItems) {
    set(() => ({ pageTreeSelectedItems: newItems }));
  },
});
