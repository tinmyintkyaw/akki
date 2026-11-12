import deleteFile from "#/files/delete-file.js";
import downloadFile from "#/files/download-file.js";
import getFile from "#/files/get-files.js";
import uploadFile from "#/files/upload-file.js";
import { Hono } from "hono";

const app = new Hono();

app.route("/", getFile);
app.route("/", uploadFile);
app.route("/", downloadFile);
app.route("/", deleteFile);

export default app;
