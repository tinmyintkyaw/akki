import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";
import { randomBytes, randomUUID } from "crypto";

import { prisma } from "@/lib/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const collabTokenHander: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    try {
      const token = await prisma.socketSession.create({
        data: {
          userId: session.accountId,
          createdAt: new Date(Date.now()),
          isUsed: false,
          sessionToken: randomUUID() ?? randomBytes(32).toString("hex"),
        },
      });

      return res.status(200).json({ collabToken: token.sessionToken });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
};

export default collabTokenHander;
