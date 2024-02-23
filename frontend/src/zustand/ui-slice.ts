import { StateCreator } from "zustand";

interface EditorSelection {
  start: number;
  end: number;
  pageChanged: boolean;
}

export interface UISlice {
  isSidebarOpen: boolean;
  isStarredSectionOpen: boolean;
  isCmdPaletteOpen: boolean;
  editorSelection: EditorSelection | null;
  toggleSidebarOpen: () => void;
  toggleStarredSectionOpen: () => void;
  setIsCmdPaletteOpen: (isOpen: boolean) => void;
  setEditorSelection: (selection: EditorSelection | null) => void;
}

export const uiSlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  isSidebarOpen: true,
  isStarredSectionOpen: false,
  isCmdPaletteOpen: false,
  editorSelection: null,

  toggleSidebarOpen: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  toggleStarredSectionOpen: () =>
    set((state) => ({ isStarredSectionOpen: !state.isStarredSectionOpen })),

  setIsCmdPaletteOpen: (isOpen) => set(() => ({ isCmdPaletteOpen: isOpen })),

  setEditorSelection: (selection) =>
    set(() => ({ editorSelection: selection })),
});
