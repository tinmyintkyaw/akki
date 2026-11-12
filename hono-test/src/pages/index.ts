import createPage from "#/pages/create-page.js";
import deletePage from "#/pages/delete-page.js";
import getPageById from "#/pages/get-page-by-id.js";
import getPages from "#/pages/get-pages.js";
import updatePage from "#/pages/update-page.js";
import { Hono } from "hono";

const app = new Hono();

app.route("/", getPages);
app.route("/", getPageById);
app.route("/", createPage);
app.route("/", updatePage);
app.route("/", deletePage);

export default app;
