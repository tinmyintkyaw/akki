import { WebSocketStatus } from "@hocuspocus/provider";
import { StateCreator } from "zustand";

export interface MultiplayerProviderSlice {
  isWSAuthenticated: boolean;
  isWSSynced: boolean;
  wsConnectionStatus: WebSocketStatus;
  setIsWSAuthenticated: (isAuthenticated: boolean) => void;
  setIsWSSynced: (isSynced: boolean) => void;
  setWSConnectionStatus: (status: WebSocketStatus) => void;
}

export const multiplayerProviderSlice: StateCreator<
  MultiplayerProviderSlice,
  [],
  [],
  MultiplayerProviderSlice
> = (set) => ({
  isWSSynced: false,
  isWSAuthenticated: false,
  wsConnectionStatus: WebSocketStatus.Disconnected,

  setWSConnectionStatus(status) {
    set(() => ({ wsConnectionStatus: status }));
  },

  setIsWSAuthenticated(isAuthenticated) {
    set(() => ({ isWSAuthenticated: isAuthenticated }));
  },

  setIsWSSynced(isSynced) {
    set(() => ({ isWSSynced: isSynced }));
  },
});
