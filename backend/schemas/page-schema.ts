import { RequestSchema } from "@/middlewares/request-validator.js";
import { z } from "zod";

const pageIdAsParamsSchema = z.object({
  pageId: z.string().ulid(),
});

const updatePagePayloadSchema = z
  .object({
    pageName: z.string().trim().min(1),
    parentId: z.string().ulid().nullable(),
    isStarred: z.boolean(),
    deletedAt: z.string().datetime().nullable(),
    accessedAt: z.string().datetime(),
  })
  .partial();

const createPagePayloadSchema = z.object({
  pageName: z.string().trim().min(1),
  parentId: z.string().ulid().nullable(),
});

export const updatePageSchema: RequestSchema = {
  params: pageIdAsParamsSchema,
  body: updatePagePayloadSchema,
};

export const createPageSchema: RequestSchema = {
  params: pageIdAsParamsSchema,
  body: createPagePayloadSchema,
};
