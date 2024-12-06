import {
  MultiplayerProviderSlice,
  multiplayerProviderSlice,
} from "@/zustand/multiplayer-provider-slice";
import { PageTreeSlice, pageTreeSlice } from "@/zustand/page-tree-slice";
import { UISlice, uiSlice } from "@/zustand/ui-slice";
import { create } from "zustand";

type ZustandStore = UISlice & MultiplayerProviderSlice & PageTreeSlice;

const useStore = create<ZustandStore>((...args) => ({
  ...uiSlice(...args),
  ...multiplayerProviderSlice(...args),
  ...pageTreeSlice(...args),
}));

export default useStore;
