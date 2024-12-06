import useStore from "@/zustand/store";
import { HocuspocusProvider, WebSocketStatus } from "@hocuspocus/provider";
import { useEffect, useRef } from "react";
import * as Y from "yjs";

const MULTIPLAYER_URL = (() => {
  const protocol = location.protocol === "http:" ? "ws:" : "wss:";
  return `${protocol}//${location.host}/api/editor`;
})();

const useMultiplayerProvider = (pageId: string) => {
  const provider = useRef<HocuspocusProvider>();

  const setIsAuthenticated = useStore((state) => state.setIsWSAuthenticated);
  const setWSConnectionStatus = useStore(
    (state) => state.setWSConnectionStatus,
  );
  const setIsSynced = useStore((state) => state.setIsWSSynced);

  useEffect(() => {
    provider.current = new HocuspocusProvider({
      name: pageId,
      url: MULTIPLAYER_URL,
      document: new Y.Doc(),
      token: "token",

      onStatus({ status }) {
        setWSConnectionStatus(status);
      },
      onAuthenticated() {
        setIsAuthenticated(true);
      },
      onAuthenticationFailed() {
        setIsAuthenticated(false);
      },
      // Event fired on initial successful sync of Y.js document
      // and to React know when to re-render the editor
      onSynced() {
        setIsSynced(true);
      },
      onDestroy() {
        setIsAuthenticated(false);
        setIsSynced(false);
        setWSConnectionStatus(WebSocketStatus.Disconnected);
      },
    });

    return () => {
      provider.current?.destroy();
    };
  }, [pageId, setIsAuthenticated, setWSConnectionStatus, setIsSynced]);

  return {
    provider: provider.current,
  };
};

export default useMultiplayerProvider;
