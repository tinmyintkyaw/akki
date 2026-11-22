import { createRouter } from "@tanstack/react-router";

import { routeTree } from "#/routeTree.gen.ts";
import { DefaultNotFoundComponent } from "#/space/components/DefaultNotFoundComponent.tsx";

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
