import { create } from "zustand";

type State = {
  isSidebarOpen: boolean;
};

type Actions = {
  toggleSidebarOpen: () => void;
};

const useStore = create<State & Actions>((set) => ({
  isSidebarOpen: true,
  toggleSidebarOpen: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useStore;
