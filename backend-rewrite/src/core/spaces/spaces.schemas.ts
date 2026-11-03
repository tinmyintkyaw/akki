import z from "zod";

export const spaceIdSchema = z.object({
  spaceId: z.uuid(),
});

export const memberIdSchema = z.object({
  memberId: z.uuid(),
});

export const memberRoleSchema = z.object({
  role: z.enum(["admin", "member"]),
});

export const spaceNameSchema = z.object({ name: z.string().min(1) });
