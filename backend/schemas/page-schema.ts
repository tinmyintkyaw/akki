import { z } from "zod";

export const pageIdAsParamsSchema = z.object({
  pageId: z.string().ulid(),
});

export type PageIdAsParamsSchema = typeof pageIdAsParamsSchema;

export const updatePagePayloadSchema = z
  .object({
    pageName: z.string().trim().min(1),
    parentId: z.string().ulid().nullable(),
    isStarred: z.boolean(),
    deletedAt: z
      .string()
      .datetime()
      .nullable()
      .transform((val) => (val ? new Date(val) : null)),
    // accessedAt: z
    //   .string()
    //   .datetime()
    //   .transform((val) => (val ? new Date(val) : null)),
    // modifiedAt: z
    //   .string()
    //   .datetime()
    //   .transform((val) => (val ? new Date(val) : null)),
  })
  .partial();

export type UpdatePagePayloadSchema = typeof updatePagePayloadSchema;

export const createPagePayload = z.object({
  pageName: z.string().trim().min(1),
  parentId: z.string().ulid().nullable(),
});

export type CreatePagePayloadSchema = typeof createPagePayload;
