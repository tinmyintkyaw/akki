import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import queryClient from "@/queryClient";
// import router from "@/router";
// import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import "@fontsource-variable/inter";
import "@fontsource-variable/jost";

import "@/styles/index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ThemeProvider defaultTheme="system" storageKey="app-ui-theme">
      <Toaster />
    </ThemeProvider>
    <ReactQueryDevtools initialIsOpen={false} position="bottom" />
  </QueryClientProvider>,
);
