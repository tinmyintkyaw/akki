import { HocuspocusProvider, WebSocketStatus } from "@hocuspocus/provider";
import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";

const MULTIPLAYER_URL = "ws://localhost:3300/editor";

const useMultiplayerProvider = (pageId: string) => {
  const provider = useRef<HocuspocusProvider>();

  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState<WebSocketStatus>(
    WebSocketStatus.Disconnected,
  );

  useEffect(() => {
    provider.current = new HocuspocusProvider({
      name: pageId,
      url: MULTIPLAYER_URL,
      document: new Y.Doc(),
      token: async () => {
        const res = await fetch("/api/session");
        if (!res.ok) return "";
        const { editorKey } = await res.json();
        return editorKey as string;
      },
      onStatus({ status }) {
        setStatus(status);
      },
      onAuthenticated() {
        setisAuthenticated(true);
        setIsReady(true);
      },
      onAuthenticationFailed() {
        setisAuthenticated(false);
        setIsReady(false);
      },
      // Event fired on initial successful sync of Y.js document
      // and to React know when to re-render the editor
      onSynced() {
        setIsReady(true);
      },
      onDestroy() {
        setIsReady(false);
      },
    });

    return () => {
      provider.current?.destroy();
    };
  }, [pageId]);

  return {
    provider: provider.current,
    isAuthenticated,
    isReady,
    status,
  };
};

export default useMultiplayerProvider;
