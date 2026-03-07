import { spacesReqParams } from "@/core/spaces/spaces.schemas";
import z from "zod";

export const tagsReqParams = spacesReqParams.extend({ tagId: z.uuid() });

export const tagCreatePayload = z.object({
  name: z.string().min(1),
  parentId: z.uuid().nullable(),
});

export const tagUpdatePayload = tagCreatePayload
  .partial()
  .refine((obj) => Object.keys(obj).length > 0);
