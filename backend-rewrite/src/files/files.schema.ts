import z from "zod";

export const spaceIdSchema = z.object({ spaceId: z.uuid() });

export const spaceFileIdSchema = spaceIdSchema.extend({ fileId: z.uuid() });
