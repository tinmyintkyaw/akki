import z from "zod";

export const pageIdSchema = z.object({ pageId: z.uuid() });

export const pageNameSchema = z.object({ name: z.string().min(1) });

export const pageQueryStringSchema = z
  .object({
    deleted: z.stringbool(),
    pinned: z.stringbool(),
  })
  .partial();

export const pageUpdatePayload = z
  .object({
    name: z.string().min(1),
    isDeleted: z.boolean(),
    isPinned: z.boolean(),
  })
  .partial();
