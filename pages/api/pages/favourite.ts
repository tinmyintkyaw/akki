import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";

const favouritePagesHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    try {
      const data = await prisma.page.findMany({
        where: {
          userId: session.accountId,
          isFavourite: true,
        },
        select: {
          id: true,
          pageName: true,
          parentPageId: true,
          createdAt: true,
          modifiedAt: true,
          isFavourite: true,
          userId: true,
        },
      });

      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }
  return res.status(405).json({ message: "Method Not Allowed" });
};

export default favouritePagesHandler;
