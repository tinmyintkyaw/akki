import { HocuspocusProvider, WebSocketStatus } from "@hocuspocus/provider";
import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";

const MULTIPLAYER_URL = process.env.MULTIPLAYER_URL
  ? process.env.MULTIPLAYER_URL
  : "ws://localhost:3300";

const useMultiplayerProvider = (pageId: string) => {
  const provider = useRef<HocuspocusProvider>();

  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState<WebSocketStatus>(
    WebSocketStatus.Disconnected
  );

  useEffect(() => {
    provider.current = new HocuspocusProvider({
      name: pageId,
      url: MULTIPLAYER_URL,
      document: new Y.Doc(),
      token: async () => {
        try {
          const response = await fetch("/api/multiplayer/token");
          if (!response.ok) return "";
          const json: { collabToken: string } = await response.json();
          return json.collabToken;
        } catch (err) {
          return "";
        }
      },
      onStatus({ status }) {
        setStatus(status);
      },
      onAuthenticated() {
        setisAuthenticated(true);
      },
      onAuthenticationFailed() {
        setisAuthenticated(false);
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
