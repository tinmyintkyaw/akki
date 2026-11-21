import { pageIdSchema, spaceIdSchema } from "#/pages/schemas.js";
import z from "zod";

export const tagIdSchema = z.object({ tagId: z.uuid() });

export const tagNameSchema = z.object({ name: z.string().min(1) });

export const tagIdListSchema = z.object({ tags: z.array(z.uuid()).min(1) });

export const spaceTagIdSchema = spaceIdSchema.extend(tagIdSchema.shape);

export const spaceTagPageIdSchema = spaceIdSchema
  .extend(tagIdSchema.shape)
  .extend(pageIdSchema.shape);
