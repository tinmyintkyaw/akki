import editorKeyController from "@/controllers/keys/editor-key-controller";
import searchKeyController from "@/controllers/keys/search-key-controller";
import express from "express";
import asyncHandler from "express-async-handler";

const keyRouter = express.Router();

keyRouter.get("/search", asyncHandler(searchKeyController));

keyRouter.get("/editor", asyncHandler(editorKeyController));

export default keyRouter;
