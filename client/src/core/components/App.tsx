import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "#src/components/ui/resizable.tsx";
import { ScrollArea } from "#src/components/ui/scroll-area.tsx";
import { PageList } from "#src/core/components/PageList.tsx";
import { Sidebar } from "#src/core/components/Sidebar.tsx";
import { CollabEditor } from "#src/editor/components/CollabEditor.tsx";
import { useParams } from "@tanstack/react-router";

export function App() {
  const { pageId } = useParams({ strict: false });

  return (
    <div className="w-full h-dvh">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="18%" minSize="10%" maxSize="25%">
          <Sidebar />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize="23%" minSize="10%" maxSize="25%">
          <PageList />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel className="flex flex-col">
          <div className="h-12 shrink-0">Hello</div>
          <ScrollArea className="flex-1 min-h-0 w-full">
            {pageId ? (
              <CollabEditor pageId={pageId} />
            ) : (
              <div>No Pages Open</div>
            )}
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
