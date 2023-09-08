import prisma from "@/db/prisma-client.js";
import { onAuthenticatePayload } from "@hocuspocus/server";

const websocketAuthHandler = async (
  data: onAuthenticatePayload,
  lastCheckedTimestamps: Map<string, number>
) => {
  const multiplayerSession = await prisma.session.findUniqueOrThrow({
    where: {
      editorKey: data.token,
    },
    select: { user_id: true },
  });

  await prisma.page.findUniqueOrThrow({
    where: {
      id_userId: {
        userId: multiplayerSession.user_id,
        id: data.documentName,
      },
    },
  });

  lastCheckedTimestamps.set(data.token, Date.now());

  return {
    userId: multiplayerSession.user_id,
    token: data.token,
  };
};

export default websocketAuthHandler;
