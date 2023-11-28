import redisClient from "@/configs/ioredis-config";
import prisma from "@/configs/prisma-client-config";
import { onAuthenticatePayload } from "@hocuspocus/server";

const websocketAuthHandler = async (
  data: onAuthenticatePayload,
  lastCheckedTimestamps: Map<string, number>,
) => {
  const multiplayerSession = JSON.parse(
    await redisClient.get(`editor:${data.token}`),
  );

  if (multiplayerSession.editorKeyReqIp !== data.context.clientIp)
    throw new Error("IP addresses does not match");

  if (new Date(multiplayerSession.editorKeyExpires).getDate() > Date.now())
    throw new Error("Key expired");

  await prisma.page.findUniqueOrThrow({
    where: {
      id_user_id: {
        user_id: multiplayerSession.userId,
        id: data.documentName,
      },
    },
  });

  await redisClient.del(`editor:${data.token}`);

  lastCheckedTimestamps.set(data.token, Date.now());

  return {
    userId: multiplayerSession.userId,
    token: data.token,
  };
};

export default websocketAuthHandler;
