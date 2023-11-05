import editorKeyController from "@/controllers/keys/editor-key-controller";
import { searchKeyController } from "@/controllers/keys/search-key-controller";
import express from "express";

const keyRouter = express.Router();

keyRouter.get("/search", searchKeyController);

keyRouter.get("/editor", editorKeyController);

export default keyRouter;
