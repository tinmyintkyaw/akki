import { createPageController } from "@/controllers/page/create-page.js";
import { deletePageController } from "@/controllers/page/delete-page.js";
import { getDeletedPageListController } from "@/controllers/page/get-deleted-page-list.js";
import { getPageListController } from "@/controllers/page/get-page-list.js";
import { getPageController } from "@/controllers/page/get-page.js";
import { updatePageController } from "@/controllers/page/update-page.js";
import { requestValidator } from "@/middlewares/request-validator.js";
import {
  pageIdAsParamsSchema,
  updatePagePayloadSchema,
} from "@/schemas/page-schema.js";
import express from "express";

const pageRouter = express.Router();

pageRouter.get("/", getPageListController);

pageRouter.post("/", createPageController);

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
