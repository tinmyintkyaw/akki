import { onAuthenticatePayload } from "@hocuspocus/server";
import { prisma } from "../lib/prismadb";

const authenticate = (data: onAuthenticatePayload) => {
  return new Promise<{ userId: string }>(async (resolve, reject) => {
    try {
      const multiplayerSession =
        await prisma.multiplayerSession.findUniqueOrThrow({
          where: {
            key: data.token,
          },
          select: {
            id: true,
            isUsed: true,
            expires: true,
            session: {
              select: {
                userId: true,
              },
            },
          },
        });

      if (multiplayerSession.isUsed) throw new Error("Invalid token");

      if (Date.now() > new Date(multiplayerSession.expires).getTime())
        throw new Error("Token expired");

      const page = await prisma.page.findUniqueOrThrow({
        where: {
          id_userId: {
            userId: multiplayerSession.session.userId,
            id: data.documentName,
          },
        },
      });

      return resolve({ userId: multiplayerSession.session.userId });
    } catch (error) {
      return reject();
    }
  });
};

export default authenticate;
