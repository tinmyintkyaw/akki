import createPageController from "@/controllers/pages/create-page-controller.js";
import deletePageController from "@/controllers/pages/delete-page-controller.js";
import getDeletedPageListController from "@/controllers/pages/deleted-page-list-controller.js";
import editPageController from "@/controllers/pages/edit-page-controller.js";
import getPageController from "@/controllers/pages/get-page-controller.js";
import getPageListController from "@/controllers/pages/get-page-list-controller.js";
import getRecentPageListController from "@/controllers/pages/recent-page-list-controller.js";
import getStarredPageListController from "@/controllers/pages/starred-page-list-controller.js";
import {
  createPagePayloadSchema,
  editPagePayloadSchema,
  pageIdAsParamsSchema,
} from "@/validations/page-validation-schemas";
import express from "express";
import { createValidator } from "express-joi-validation";

const pageRouter = express.Router();
const validator = createValidator();

pageRouter.get("/", getPageListController);

pageRouter.post(
  "/",
  validator.body(createPagePayloadSchema),
  createPageController,
);

pageRouter.get("/recent", getRecentPageListController);

pageRouter.get("/deleted", getDeletedPageListController);

pageRouter.get("/starred", getStarredPageListController);

pageRouter.get(
  "/:pageId",
  validator.params(pageIdAsParamsSchema),
  getPageController,
);

pageRouter.delete(
  "/:pageId",
  validator.params(pageIdAsParamsSchema),
  deletePageController,
);

pageRouter.patch(
  "/:pageId",
  validator.params(pageIdAsParamsSchema),
  validator.body(editPagePayloadSchema),
  editPageController,
);

export default pageRouter;
