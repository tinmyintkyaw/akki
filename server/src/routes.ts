import { collab } from "#/collab/index.js";
import { pages } from "#/pages/index.js";
import { search } from "#/search/index.js";
import { tags } from "#/tags/index.js";
import { Hono } from "hono";

export const routes = new Hono()
  .route("/", search)
  .route("/", pages)
  .route("/", tags)
  .route("/", collab);

export type AppType = typeof routes;
