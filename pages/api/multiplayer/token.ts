import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";
import { randomBytes, randomUUID } from "crypto";

import { prisma } from "@/lib/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const collabTokenHander: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (typeof req.cookies["next-auth.session-token"] === "undefined")
    return res.status(500).json({ message: "Internal Server Error" });

  if (req.method === "GET") {
    const sessionToken = req.cookies["next-auth.session-token"];
    try {
      const session = await prisma.session.findUniqueOrThrow({
        where: {
          sessionToken: sessionToken,
        },
      });

      const multiplayerSession = await prisma.multiplayerSession.create({
        data: {
          sessionId: session.id,
          key: randomUUID() ?? randomBytes(32).toString("hex"),
          isUsed: false,
          expires: new Date(Date.now() + 30 * 1000), // 30 seconds
        },
      });

      return res.status(200).json({ collabToken: multiplayerSession.key });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err });
    }
  }
  return res.status(405).json({ message: "Method Not Allowed" });
};

export default collabTokenHander;
