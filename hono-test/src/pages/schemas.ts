import z from "zod";

export const spaceIdSchema = z.object({ spaceId: z.uuid() });

export const pageIdSchema = z.object({ pageId: z.uuid() });

export const pageNameSchema = z.object({ name: z.string().min(1) });

export const spacePageIdSchema = spaceIdSchema.extend(pageIdSchema.shape);

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
