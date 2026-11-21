import { createPage } from "#/pages/create-page.js";
import { deletePage } from "#/pages/delete-page.js";
import { getPageById } from "#/pages/get-page-by-id.js";
import { getPages } from "#/pages/get-pages.js";
import { updatePage } from "#/pages/update-page.js";
import { Hono } from "hono";

export const pages = new Hono()
  .route("/", getPages)
  .route("/", getPageById)
  .route("/", createPage)
  .route("/", updatePage)
  .route("/", deletePage);
