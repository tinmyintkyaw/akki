import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "#src/components/ui/resizable.tsx";
import { PageList } from "#src/core/components/PageList.tsx";
import { Sidebar } from "#src/core/components/Sidebar.tsx";
import { CollabEditor } from "#src/editor/components/CollabEditor.tsx";

export function App() {
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
          <CollabEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
