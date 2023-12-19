import { WebSocketStatus } from "@hocuspocus/provider";
import { create } from "zustand";

type EditorSelection = {
  start: number;
  end: number;
  pageChanged: boolean;
};

type State = {
  isSidebarOpen: boolean;
  isCmdPaletteOpen: boolean;
  editorSelection: EditorSelection | null;
  isWSAuthenticated: boolean;
  isWSSynced: boolean;
  wsConnectionStatus: WebSocketStatus;
};

type Actions = {
  toggleSidebarOpen: () => void;
  setIsCmdPaletteOpen: (isOpen: boolean) => void;
  setEditorSelection: (selection: EditorSelection | null) => void;
  setIsWSAuthenticated: (isAuthenticated: boolean) => void;
  setIsWSSynced: (isSynced: boolean) => void;
  setWSConnectionStatus: (status: WebSocketStatus) => void;
};

const useStore = create<State & Actions>((set) => ({
  isSidebarOpen: true,
  toggleSidebarOpen: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  isCmdPaletteOpen: false,
  setIsCmdPaletteOpen: (isOpen) => set(() => ({ isCmdPaletteOpen: isOpen })),

  editorSelection: null,
  setEditorSelection: (selection) =>
    set(() => ({ editorSelection: selection })),

  wsConnectionStatus: WebSocketStatus.Disconnected,
  setWSConnectionStatus(status) {
    set(() => ({ wsConnectionStatus: status }));
  },

  isWSAuthenticated: false,
  setIsWSAuthenticated(isAuthenticated) {
    set(() => ({ isWSAuthenticated: isAuthenticated }));
  },

  isWSSynced: false,
  setIsWSSynced(isSynced) {
    set(() => ({ isWSSynced: isSynced }));
  },
}));

export default useStore;
