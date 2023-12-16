import { create } from "zustand";

type State = {
  isSidebarOpen: boolean;
  isCmdPaletteOpen: boolean;
  editorCursor: number | null;
};

type Actions = {
  toggleSidebarOpen: () => void;
  setIsCmdPaletteOpen: (isOpen: boolean) => void;
  setEditorCursor: (cursor: number | null) => void;
};

const useStore = create<State & Actions>((set) => ({
  isSidebarOpen: true,
  toggleSidebarOpen: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  isCmdPaletteOpen: false,
  setIsCmdPaletteOpen: (isOpen) => set(() => ({ isCmdPaletteOpen: isOpen })),

  editorCursor: null,
  setEditorCursor: (cursor) => set(() => ({ editorCursor: cursor })),
}));

export default useStore;
