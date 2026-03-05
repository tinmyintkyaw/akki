import z from "zod";

export const spacesReqParams = z.object({
  spaceId: z.uuid(),
});

export const spacesCreateUpdatePayload = z.object({ name: z.string().min(1) });

export const spaceAddMembersPayload = z.object({ members: z.array(z.uuid()) });

export const spaceRemoveMemberPayload = z.object({ member: z.uuid() });
