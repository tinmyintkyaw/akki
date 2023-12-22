import Sidebar from "@/components/sidebar/Sidebar";
import useInstantSearchClient from "@/hooks/useInstantSearchClient";
import useStore from "@/zustand/store";
import { Allotment, LayoutPriority } from "allotment";
import { InstantSearch } from "react-instantsearch";
import { Outlet } from "react-router-dom";

import Toolbar from "@/components/toolbar/Toolbar";
import "allotment/dist/style.css";

export default function Layout() {
  const instantSearchClient = useInstantSearchClient();

  const isSidebarOpen = useStore((state) => state.isSidebarOpen);

  return (
    <main className="h-[100dvh] w-screen">
      <InstantSearch searchClient={instantSearchClient} indexName="pages">
        <Allotment proportionalLayout={false} separator={false}>
          <Allotment.Pane
            minSize={250}
            preferredSize={350}
            maxSize={600}
            priority={LayoutPriority.Low}
            visible={isSidebarOpen}
          >
            <Sidebar />
          </Allotment.Pane>

          <Allotment.Pane>
            <Toolbar />
            <Outlet />
          </Allotment.Pane>
        </Allotment>
      </InstantSearch>
    </main>
  );
}
