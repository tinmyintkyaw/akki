import getFileController from "@/controllers/files/get-file-controller.js";
import uploadFileController from "@/controllers/files/upload-file-controller.js";
import express from "express";

const fileRouter = express.Router();

fileRouter.post("/", uploadFileController);

fileRouter.get("/:fileId", getFileController);

export default fileRouter;
