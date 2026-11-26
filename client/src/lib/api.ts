import type { ServerRoutes } from "@repo/server/api";
import { hc, type InferResponseType } from "hono/client";

const apiClient = hc<ServerRoutes>("/api");

type Page = InferResponseType<
  (typeof apiClient.spaces)[":spaceId"]["pages"][":pageId"]["$get"],
  200
>;

export { apiClient, type Page };
