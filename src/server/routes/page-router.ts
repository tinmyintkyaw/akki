import createPageController from "@/controllers/pages/create-page-controller";
import deletePageController from "@/controllers/pages/delete-page-controller";
import getDeletedPageListController from "@/controllers/pages/deleted-page-list-controller";
import editPageController from "@/controllers/pages/edit-page-controller";
import getPageController from "@/controllers/pages/get-page-controller";
import getPageListController from "@/controllers/pages/get-page-list-controller";
import getRecentPageListController from "@/controllers/pages/recent-page-list-controller";
import getStarredPageListController from "@/controllers/pages/starred-page-list-controller";
import {
  createPagePayloadSchema,
  editPagePayloadSchema,
  pageIdAsParamsSchema,
} from "@/validations/page-validation-schemas";
import express from "express";
import asyncHandler from "express-async-handler";
import { createValidator } from "express-joi-validation";

const pageRouter = express.Router();
const validator = createValidator();

pageRouter.get("/", asyncHandler(getPageListController));

pageRouter.post(
  "/",
  validator.body(createPagePayloadSchema),
  asyncHandler(createPageController),
);

pageRouter.get("/recent", asyncHandler(getRecentPageListController));

pageRouter.get("/deleted", asyncHandler(getDeletedPageListController));

pageRouter.get("/starred", asyncHandler(getStarredPageListController));

pageRouter.get(
  "/:pageId",
  validator.params(pageIdAsParamsSchema),
  asyncHandler(getPageController),
);

pageRouter.delete(
  "/:pageId",
  validator.params(pageIdAsParamsSchema),
  asyncHandler(deletePageController),
);

pageRouter.patch(
  "/:pageId",
  validator.params(pageIdAsParamsSchema),
  validator.body(editPagePayloadSchema),
  asyncHandler(editPageController),
);

export default pageRouter;
