import { createPageController } from "@/pages/controllers/create-page.js";
import { deletePageController } from "@/pages/controllers/delete-page.js";
import { getDeletedPageListController } from "@/pages/controllers/get-deleted-page-list.js";
import { getPageListController } from "@/pages/controllers/get-page-list.js";
import { getPageController } from "@/pages/controllers/get-page.js";
import { getRecentPageListController } from "@/pages/controllers/get-recent-page-list.js";
import { getStarredPageListController } from "@/pages/controllers/get-starred-page-list.js";
import { updatePageController } from "@/pages/controllers/update-page.js";
import { requestValidator } from "@/validation/request-validator.js";
import {
  pageIdAsParamsSchema,
  updatePagePayloadSchema,
} from "@/validation/schemas/page-schema.js";
import express from "express";

const pageRouter = express.Router();

pageRouter.get("/", getPageListController);
pageRouter.post("/", createPageController);
pageRouter.get("/starred", getStarredPageListController);
pageRouter.get("/recent", getRecentPageListController);
pageRouter.get("/deleted", getDeletedPageListController);

pageRouter.get(
  "/:pageId",
  requestValidator({ params: pageIdAsParamsSchema }),
  getPageController,
);

pageRouter.patch(
  "/:pageId",
  requestValidator({
    params: pageIdAsParamsSchema,
    body: updatePagePayloadSchema,
  }),
  updatePageController,
);

pageRouter.delete(
  "/:pageId",
  requestValidator({ params: pageIdAsParamsSchema }),
  deletePageController,
);

export { pageRouter };
