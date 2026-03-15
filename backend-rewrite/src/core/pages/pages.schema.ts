import { spacesReqParams } from "@/core/spaces/spaces.schemas";
import z from "zod";

export const pagesReqParams = spacesReqParams.extend({ pageId: z.uuid() });

export const pageTagReqParams = pagesReqParams.extend({ tagId: z.uuid() });

export const pageQueryString = z.object({
  tag: z.uuid().optional(),
  deleted: z.stringbool().optional(),
  untagged: z.stringbool().optional(),
  cursor: z.uuid().optional(),
  limit: z.coerce.number().min(10).max(100).default(40),
});

export const pageCreatePayload = z.object({
  name: z.string().min(1),
});

export const pageUpdatePayload = pageCreatePayload
  .extend({ deletedAt: z.iso.datetime().nullable() })
  .partial()
  .refine((obj) => Object.keys(obj).length > 0);

export const pageResponse = z.object({
  id: z.uuid(),
  name: z.string(),
  createdBy: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  spaceId: z.uuid(),
});

export const pagesResponse = z.object({
  hasMore: z.boolean(),
  pages: z.array(pageResponse),
});
