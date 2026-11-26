import {
  HocuspocusProviderWebsocketComponent,
  HocuspocusRoom,
} from "@hocuspocus/provider-react";
import { Editor } from "#src/editor/components/Editor.tsx";
import { authClient } from "#src/lib/auth.ts";
import { socketProvider } from "#src/editor/lib/websocket-provider.ts";
import { useParams } from "@tanstack/react-router";
import { EditorHeader } from "#src/editor/components/EditorHeader.tsx";
import { ScrollArea } from "#src/components/ui/scroll-area.tsx";

const getCollabToken = async () => {
  const token = await authClient.oneTimeToken.generate();

  if (token.error) return "";
  return token.data.token;
};

export function CollabEditor() {
  const { pageId } = useParams({ strict: false });

  if (!pageId)
    return (
      <div className="w-full h-full flex items-center justify-center select-none text-muted-foreground">
        <p>No Pages Open</p>
      </div>
    );

  return (
    <>
      <EditorHeader />

      <HocuspocusProviderWebsocketComponent websocketProvider={socketProvider}>
        <ScrollArea className="flex-1 min-h-0 w-full">
          <HocuspocusRoom
            key={pageId}
            name={pageId}
            token={getCollabToken}
            // TODO: handle when auth failed
            onAuthenticationFailed={() => console.log("auth failed")}
            sessionAwareness={true}
          >
            <Editor />
          </HocuspocusRoom>
        </ScrollArea>
      </HocuspocusProviderWebsocketComponent>
    </>
  );
}
