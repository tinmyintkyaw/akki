import createPageController from "@/controllers/pages/create-page-controller.js";
import deletePageController from "@/controllers/pages/delete-page-controller.js";
import getDeletedPageListController from "@/controllers/pages/deleted-page-list-controller.js";
import editPageController from "@/controllers/pages/edit-page-controller.js";
import getPageController from "@/controllers/pages/get-page-controller.js";
import getPageListController from "@/controllers/pages/get-page-list-controller.js";
import getRecentPageListController from "@/controllers/pages/recent-page-list-controller.js";
import getStarredPageListController from "@/controllers/pages/starred-page-list-controller.js";
import {
  validateCreatePageBody,
  validateEditPageBody,
} from "@/middlewares/validate-req-body.js";
import express from "express";

const pageRouter = express.Router();

pageRouter.get("/", getPageListController);

pageRouter.post("/", validateCreatePageBody, createPageController);

pageRouter.get("/recent", getRecentPageListController);

pageRouter.get("/deleted", getDeletedPageListController);

pageRouter.get("/starred", getStarredPageListController);

pageRouter.get("/:pageId", getPageController);

pageRouter.delete("/:pageId", deletePageController);

pageRouter.patch("/:pageId", validateEditPageBody, editPageController);

export default pageRouter;
