import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import queryClient from "@/queryClient";
import router from "@/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "@fontsource-variable/inter";
import "@fontsource-variable/jost";

import "@/styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="app-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
    <ReactQueryDevtools initialIsOpen={false} position="bottom" />
  </QueryClientProvider>,
);
