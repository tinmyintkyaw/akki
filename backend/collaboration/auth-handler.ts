import { redisClient } from "@/configs/ioredis.js";
import { db } from "@/db/kysely.js";
import { onAuthenticatePayload } from "@hocuspocus/server";

export const websocketAuthHandler = async (
  data: onAuthenticatePayload,
  lastCheckedTimestamps: Map<string, number>,
) => {
  const redisSession = await redisClient.get(`editor:${data.token}`);
  if (!redisSession) throw new Error("Invalid token");

  const multiplayerSession = JSON.parse(redisSession);

  if (multiplayerSession.editorKeyReqIp !== data.context.clientIp)
    throw new Error("IP addresses does not match");

  if (new Date(multiplayerSession.editorKeyExpires).getDate() > Date.now())
    throw new Error("Key expired");

  await db
    .selectFrom("page")
    .where("id", "=", data.documentName)
    .where("user_id", "=", multiplayerSession.userId)
    .executeTakeFirstOrThrow();

  await redisClient.del(`editor:${data.token}`);

  lastCheckedTimestamps.set(data.token, Date.now());

  return {
    userId: multiplayerSession.userId,
    token: data.token,
  };
};
