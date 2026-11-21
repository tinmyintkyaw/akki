import { deleteFile } from "#/files/delete-file.js";
import { downloadFile } from "#/files/download-file.js";
import { getFiles } from "#/files/get-files.js";
import { uploadFile } from "#/files/upload-file.js";
import { Hono } from "hono";

export const files = new Hono()
  .route("/", getFiles)
  .route("/", uploadFile)
  .route("/", downloadFile)
  .route("/", deleteFile);
