import editorKeyController from "@/controllers/keys/editor-key-controller";
import express from "express";
import asyncHandler from "express-async-handler";

const keyRouter = express.Router();

keyRouter.get("/editor", asyncHandler(editorKeyController));

export default keyRouter;
