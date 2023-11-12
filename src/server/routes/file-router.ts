import getFileController from "@/controllers/files/get-file-controller";
import uploadFileController from "@/controllers/files/upload-file-controller";
import express from "express";
import asyncHandler from "express-async-handler";

const fileRouter = express.Router();

fileRouter.post("/", asyncHandler(uploadFileController));

fileRouter.get("/:fileId", asyncHandler(getFileController));

export default fileRouter;
