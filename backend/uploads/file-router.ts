import { deleteFileController } from "@/uploads/delete-file.js";
import { getFileController } from "@/uploads/get-file.js";
import { multerMiddleware } from "@/uploads/multer.js";
import { uploadFileController } from "@/uploads/upload-file.js";
import express from "express";

const fileRouter = express.Router();

fileRouter.post("/", multerMiddleware.single("image"), uploadFileController);

fileRouter.get("/:fileId", getFileController);

fileRouter.delete("/:fileName", deleteFileController);

export default fileRouter;
