import { spacesReqParams } from "@/core/spaces/spaces.schemas";
import z from "zod";

export const pagesReqParams = spacesReqParams.extend({ pageId: z.uuid() });

export const pageTagReqParams = pagesReqParams.extend({ tagId: z.uuid() });

export const pageQueryString = z
  .object({
    tag: z.uuid(),
    deleted: z.stringbool(),
  })
  .partial();

export const pageCreatePayload = z.object({
  name: z.string().min(1),
});

export const pageUpdatePayload = pageCreatePayload
  .extend({ deletedAt: z.iso.datetime().nullable() })
  .partial()
  .refine((obj) => Object.keys(obj).length > 0);
