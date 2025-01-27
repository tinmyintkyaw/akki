import AppSidebar from "@/components/sidebar/Sidebar";
import Toolbar from "@/components/toolbar/Toolbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import "allotment/dist/style.css";
import { InstantSearch } from "react-instantsearch";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const instantSearchClient = instantMeiliSearch(
    `${window.location.protocol}//${window.location.host}/api/search`,
  );

  // const isSidebarOpen = useStore((state) => state.isSidebarOpen);

  return (
    <main className="h-[100dvh] w-screen">
      <InstantSearch
        searchClient={instantSearchClient.searchClient}
        indexName="pages"
      >
        <SidebarProvider
          style={
            {
              "--sidebar-width": "20rem",
              "--sidebar-width-mobile": "20rem",
            } as React.CSSProperties
          }
        >
          <AppSidebar />

          <main className="relative flex min-h-svh flex-1 flex-col bg-background">
            <Toolbar />
            <Outlet />
          </main>
        </SidebarProvider>

        {/* <Allotment proportionalLayout={false} separator={false}>
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
        </Allotment> */}
      </InstantSearch>
    </main>
  );
}
