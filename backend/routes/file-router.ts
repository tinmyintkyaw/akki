import { deleteFileController } from "@/controllers/file/delete-file.js";
import { getFileController } from "@/controllers/file/get-file.js";
import { uploadFileController } from "@/controllers/file/upload-file.js";
import { multerMiddleware } from "@/middlewares/multer.js";
import express from "express";

const fileRouter = express.Router();

fileRouter.post("/", multerMiddleware.single("image"), uploadFileController);

fileRouter.get("/:fileId", getFileController);

fileRouter.delete("/:fileName", deleteFileController);

export default fileRouter;
