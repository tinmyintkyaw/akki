import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useLayoutEffect, useState } from "react";
import * as Y from "yjs";
import useMultiplayerKey from "./useMultiplayerKey";

interface useMultiplayerEditorProps {
  documentName: string;
}

const useMultiplayerEditor = (props: useMultiplayerEditorProps) => {
  const { documentName } = props;

  const multiplayerKeyQuery = useMultiplayerKey();

  const [ydoc, setYdoc] = useState<Y.Doc>(new Y.Doc());
  const [multiplayerProvider, setProvider] =
    useState<HocuspocusProvider | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useLayoutEffect(() => {
    if (multiplayerKeyQuery.isLoading || multiplayerKeyQuery.isError) return;

    const provider = new HocuspocusProvider({
      url: `ws://localhost:8080/collaboration/${documentName}`,
      name: documentName,
      document: ydoc,
      token: multiplayerKeyQuery.data.collabToken,
    });

    setProvider(provider);

    return () => {
      provider.destroy();
      setProvider(null);
    };
  }, [
    ydoc,
    documentName,
    multiplayerKeyQuery.data,
    multiplayerKeyQuery.isLoading,
    multiplayerKeyQuery.isError,
  ]);

  useEffect(() => {
    if (!multiplayerProvider) return;
    const { isAuthenticated, isAuthenticationRequired } = multiplayerProvider;
    if (isAuthenticated && !isAuthenticationRequired) return setRetryCount(0);
    if (retryCount >= 3) return;

    const timeout = setTimeout(() => {
      multiplayerKeyQuery.refetch();
      setRetryCount((prev) => prev + 1);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [
    retryCount,
    multiplayerKeyQuery,
    multiplayerProvider,
    multiplayerProvider?.isAuthenticated,
    multiplayerProvider?.isAuthenticationRequired,
  ]);

  useEffect(() => {
    if (!multiplayerProvider) return;
    setIsReady(true);
  }, [multiplayerProvider]);

  return { multiplayerProvider, ydoc, isReady };
};

export default useMultiplayerEditor;
