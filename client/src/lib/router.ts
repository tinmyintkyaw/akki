import { createRouter } from "@tanstack/react-router";

import { DefaultNotFoundComponent } from "#src/core/components/DefaultNotFoundComponent.tsx";
import { routeTree } from "#src/routeTree.gen.ts";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultNotFoundComponent: DefaultNotFoundComponent,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export { router };
