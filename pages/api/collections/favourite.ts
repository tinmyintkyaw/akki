import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";

const favouritePagesHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    try {
      const favouriteCollections = await prisma.collection.findMany({
        where: {
          userId: session.accountId,
          isFavourite: true,
        },
        select: {
          id: true,
          collectionName: true,
          isFavourite: true,
          createdAt: true,
          accessedAt: true,
          modifiedAt: true,
          userId: true,
          pages: {
            select: {
              id: true,
            },
          },
        },
      });

      const responseData = favouriteCollections.map((collection) => {
        const childPageIds = collection.pages.map((page) => page.id);
        return { ...collection, pages: childPageIds };
      });

      return res.status(200).json(responseData);
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }
  return res.status(405).json({ message: "Method Not Allowed" });
};

export default favouritePagesHandler;
