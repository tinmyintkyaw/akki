import createTag from "#/tags/create-tag.js";
import deleteTag from "#/tags/delete-tag.js";
import getTags from "#/tags/get-tags.js";
import tagPage from "#/tags/tag-page.js";
import untagPage from "#/tags/untag-page.js";
import { Hono } from "hono";

const app = new Hono();

app.route("/", createTag);
app.route("/", deleteTag);
app.route("/", getTags);
app.route("/", tagPage);
app.route("/", untagPage);

export default app;
