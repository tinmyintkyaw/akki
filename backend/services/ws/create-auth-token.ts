import { redisClient } from "@/configs/ioredis.js";

export const createWSAuthToken = async (
  userId: string,
  sessionId: string,
  clientIp: string,
) => {
  const wsAuthToken = crypto.randomUUID();

  await redisClient.set(
    `editor:${wsAuthToken}`,
    JSON.stringify({
      editorKeyExpires: Date.now() + 1 * 60 * 1000,
      editorKeyReqIp: clientIp,
      userId: userId,
      sessionId: sessionId,
    }),
  );

  return wsAuthToken;
};
