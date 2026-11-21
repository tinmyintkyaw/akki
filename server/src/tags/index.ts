import { createTag } from "#/tags/create-tag.js";
import { deleteTag } from "#/tags/delete-tag.js";
import { getTags } from "#/tags/get-tags.js";
import { tagPage } from "#/tags/tag-page.js";
import { untagPage } from "#/tags/untag-page.js";
import { Hono } from "hono";

export const tags = new Hono()
  .route("/", createTag)
  .route("/", deleteTag)
  .route("/", getTags)
  .route("/", tagPage)
  .route("/", untagPage);
