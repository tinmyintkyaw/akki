import { spaceIdSchema } from "#/pages/schemas.js";
import z from "zod";

export const spaceFileIdSchema = spaceIdSchema.extend({ fileId: z.uuid() });
