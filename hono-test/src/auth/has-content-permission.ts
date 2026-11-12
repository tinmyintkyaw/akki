import { auth } from "#/auth/auth.js";

export const hasContentPermissions = async (
  headers: Headers,
  spaceId: string,
  permission: "read" | "write",
) => {
  try {
    const result = await auth.api.hasPermission({
      headers,
      body: {
        organizationId: spaceId,
        permissions: { content: [permission] },
      },
    });

    return result.success;
  } catch (error) {
    return false;
  }
};
