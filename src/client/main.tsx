import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SidebarContextProvider } from "@/contexts/SidebarContext";
import "@/styles/index.css";
import queryClient from "@/queryClient";
import router from "@/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="app-ui-theme">
      <SidebarContextProvider>
        <RouterProvider router={router} />
        <Toaster />
      </SidebarContextProvider>
    </ThemeProvider>
    <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
  </QueryClientProvider>,
);
