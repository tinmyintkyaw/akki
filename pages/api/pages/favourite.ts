import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";
import { pageSelect } from ".";

const favouritePagesHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    try {
      const favouritePages = await prisma.page.findMany({
        where: {
          userId: session.accountId,
          isFavourite: true,
        },
        select: pageSelect,
        orderBy: {
          createdAt: "asc",
        },
      });

      const response = favouritePages.map((page) => {
        const { collection, ...transformedPage } = {
          ...page,
          collectionName: page.collection.collectionName,
        };
        return transformedPage;
      });

      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }
  return res.status(405).json({ message: "Method Not Allowed" });
};

export default favouritePagesHandler;
