import Sidebar from "@/components/sidebar/Sidebar";
import { SidebarContext } from "@/contexts/SidebarContext";
import useInstantSearchClient from "@/hooks/useInstantSearchClient";
import { useSession } from "@/hooks/useSession";
import { Allotment, LayoutPriority } from "allotment";
import { useContext, useEffect } from "react";
import { InstantSearch } from "react-instantsearch";
import { Outlet, useNavigate } from "react-router-dom";

import "allotment/dist/style.css";

export default function Layout() {
  const sidebarContext = useContext(SidebarContext);

  const { status } = useSession();
  const navigate = useNavigate();
  const instantSearchClient = useInstantSearchClient();

  useEffect(() => {
    if (status === "unauthenticated") navigate("/signin");
  }, [navigate, status]);

  return (
    <main className="h-screen w-screen">
      {status === "authenticated" && (
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
              <Outlet />
            </Allotment.Pane>
          </Allotment>
        </InstantSearch>
      )}
    </main>
  );
}
