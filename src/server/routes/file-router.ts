import getFileController from "@/controllers/files/get-file-controller";
import uploadFileController from "@/controllers/files/upload-file-controller";
import multerMiddleware from "@/middlewares/multer";
import deleteFileController from "@/routes/delete-file-controller";
import express from "express";

const fileRouter = express.Router();

fileRouter.post("/", multerMiddleware.single("image"), uploadFileController);

fileRouter.get("/:fileId", getFileController);

fileRouter.delete("/:fileName", deleteFileController);

export default fileRouter;
