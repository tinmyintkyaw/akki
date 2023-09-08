import prisma from "@/db/prisma-client.js";
import { beforeHandleMessagePayload } from "@hocuspocus/server";

const sessionValidateInterval = 10 * 60 * 1000;
const jitter = Math.floor(Math.random() * 5000);

const messageHandler = async (
  data: beforeHandleMessagePayload,
  lastCheckedTimestamps: Map<string, number>
) => {
  const sessionTimestamp = lastCheckedTimestamps.get(data.context.sessionId);
  if (!sessionTimestamp) throw new Error();

  if (Date.now() - sessionTimestamp >= sessionValidateInterval + jitter) {
    await prisma.session.findUniqueOrThrow({
      where: {
        editorKey: data.context.token,
      },
    });

    lastCheckedTimestamps.set(data.context.token, Date.now());

    return data;
  }

  return data;
};

export default messageHandler;
