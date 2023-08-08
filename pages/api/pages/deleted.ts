import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";

const trashPagesHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    try {
      const pages = await prisma.page.findMany({
        where: {
          userId: session.accountId,
          isDeleted: true,
        },
        select: {
          id: true,
          pageName: true,
          isFavourite: true,
          createdAt: true,
          accessedAt: true,
          modifiedAt: true,
          collectionId: true,
          userId: true,
          isDeleted: true,
          deletedAt: true,
          collection: {
            select: { collectionName: true },
          },
        },
      });

      const response = pages.map((page) => {
        const { collection, ...transformedPage } = {
          ...page,
          collectionName: page.collection.collectionName,
        };
        return transformedPage;
      });

      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  return res.status(405).json({ message: "Method Not Allowed" });
};

export default trashPagesHandler;
