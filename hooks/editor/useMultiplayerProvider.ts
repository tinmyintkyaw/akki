import { HocuspocusProvider, WebSocketStatus } from "@hocuspocus/provider";
import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";

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
      url: `ws://localhost:8080/collaboration`,
      document: new Y.Doc(),
      token: async () => {
        try {
          const response = await fetch("/api/collab/token");
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
      // and set a state to let React know when to re-render the editor
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
