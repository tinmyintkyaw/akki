import prisma from "@/db/prisma-client.js";
import { onAuthenticatePayload } from "@hocuspocus/server";

const websocketAuthHandler = async (
  data: onAuthenticatePayload,
  lastCheckedTimestamps: Map<string, number>,
) => {
  const multiplayerSession = await prisma.session.findUniqueOrThrow({
    where: {
      editorKey: data.token,
    },
    select: { user_id: true, editorKeyExpires: true, editorKeyReqIp: true },
  });

  if (multiplayerSession.editorKeyReqIp !== data.context.clientIp)
    throw new Error("IP addresses does not match");

  if (multiplayerSession.editorKeyExpires.getDate() > Date.now())
    throw new Error("Key expired");

  await prisma.page.findUniqueOrThrow({
    where: {
      id_userId: {
        userId: multiplayerSession.user_id,
        id: data.documentName,
      },
    },
  });

  // auth key for websocket connection is single use only
  await prisma.session.update({
    where: {
      editorKey: data.token,
    },
    data: {
      editorKey: null,
      editorKeyExpires: null,
    },
  });

  lastCheckedTimestamps.set(data.token, Date.now());

  return {
    userId: multiplayerSession.user_id,
    token: data.token,
  };
};

export default websocketAuthHandler;
