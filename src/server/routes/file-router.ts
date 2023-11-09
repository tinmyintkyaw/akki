import getFileController from "@/controllers/files/get-file-controller.js";
import uploadFileController from "@/controllers/files/upload-file-controller.js";
import express from "express";
import asyncHandler from "express-async-handler";

const fileRouter = express.Router();

fileRouter.post("/", asyncHandler(uploadFileController));

fileRouter.get("/:fileId", asyncHandler(getFileController));

export default fileRouter;
