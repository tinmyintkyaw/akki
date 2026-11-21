import type { ServerRoutes } from "@repo/server/api";
import { hc } from "hono/client";

const client = hc<ServerRoutes>("/api");

export { client as apiClient };
