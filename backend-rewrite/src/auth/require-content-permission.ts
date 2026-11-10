import { preHandlerAsyncHookHandler } from "fastify";

export const requireContentPermission = (
  perm: "read" | "write",
): preHandlerAsyncHookHandler => {
  return async (req, res) => {
    const params = req.params as Record<string, unknown> | null;

    if (!params || typeof params.spaceId !== "string") {
      return res.badRequest();
    }

    const spaceId = params.spaceId;

    const result = await req.server.auth.api.hasPermission({
      headers: req.headers,
      body: {
        organizationId: spaceId,
        permission: { content: [perm] },
      },
    });

    if (!result.success) return res.unauthorized();
  };
};
