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
} from "@/middlewares/page-router-payload-schema";
import addFormats from "ajv-formats";
import express from "express";
import { Validator } from "express-json-validator-middleware";

const validator = new Validator({});
addFormats(validator.ajv, { formats: ["date-time"] });

const pageRouter = express.Router();

pageRouter.get("/", getPageListController);

pageRouter.post(
  "/",
  validator.validate({ body: createPagePayloadSchema }),
  createPageController,
);

pageRouter.get("/recent", getRecentPageListController);

pageRouter.get("/deleted", getDeletedPageListController);

pageRouter.get("/starred", getStarredPageListController);

pageRouter.get("/:pageId", getPageController);

pageRouter.delete("/:pageId", deletePageController);

pageRouter.patch(
  "/:pageId",
  validator.validate({ body: editPagePayloadSchema }),
  editPageController,
);

export default pageRouter;
