import z from "zod";

export const spaceIdSchema = z.object({ spaceId: z.uuid() });

export const tagIdSchema = z.object({ tagId: z.uuid() });

export const pageIdSchema = z.object({ pageId: z.uuid() });

export const tagNameSchema = z.object({ name: z.string().min(1) });

export const tagIdListSchema = z.object({ tags: z.array(z.uuid()).min(1) });

export const spaceTagIdSchema = spaceIdSchema.extend(tagIdSchema.shape);

export const spaceTagPageIdSchema = spaceIdSchema
  .extend(tagIdSchema.shape)
  .extend(pageIdSchema.shape);
