import z from "zod";

export const spaceIdSchema = z.object({ spaceId: z.uuid() });

export const pageIdSchema = z.object({ pageId: z.uuid() });

export const pageNameSchema = z.object({ name: z.string().min(1) });

export const spacePageIdSchema = spaceIdSchema.extend(pageIdSchema.shape);

const queryBoolean = z.union([z.boolean(), z.stringbool()]);

export const pageQueryStringSchema = z
  .object({
    deleted: queryBoolean,
    pinned: queryBoolean,
    tags: z.preprocess((val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string" && val.length > 0) return [val];
      return undefined;
    }, z.array(z.uuid())),
  })
  .partial();

export const pageUpdatePayload = z
  .object({
    name: z.string().min(1),
    isDeleted: z.boolean(),
    isPinned: z.boolean(),
  })
  .partial();
