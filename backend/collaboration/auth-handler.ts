import { auth } from "@/auth/better-auth.js";
import { onAuthenticatePayload } from "@hocuspocus/server";
import { fromNodeHeaders } from "better-auth/node";

export const websocketAuthHandler = async (
  data: onAuthenticatePayload,
  lastCheckedTimestamps: Map<string, number>,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(data.requestHeaders),
  });

  if (!session) throw new Error("Invalid session");

  return {
    userId: session.user.id,
  };
};
