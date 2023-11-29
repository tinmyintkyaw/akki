import Sidebar from "@/components/sidebar/Sidebar";
import { SidebarContext } from "@/contexts/SidebarContext";
import useInstantSearchClient from "@/hooks/useInstantSearchClient";
import { Allotment, LayoutPriority } from "allotment";
import { useContext } from "react";
import { InstantSearch } from "react-instantsearch";
import { Outlet } from "react-router-dom";

import "allotment/dist/style.css";
import Toolbar from "@/components/toolbar/Toolbar";

export default function Layout() {
  const sidebarContext = useContext(SidebarContext);
  const instantSearchClient = useInstantSearchClient();

  return (
    <main className="h-[100dvh] w-screen">
      <InstantSearch searchClient={instantSearchClient} indexName="pages">
        <Allotment proportionalLayout={false}>
          <Allotment.Pane
            minSize={250}
            preferredSize={350}
            maxSize={600}
            priority={LayoutPriority.Low}
            visible={sidebarContext.isSidebarOpen}
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
