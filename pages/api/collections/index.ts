import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { Prisma } from "@prisma/client";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prismadb";

export const collectionSelect = {
  id: true,
  collectionName: true,
  isFavourite: true,
  createdAt: true,
  accessedAt: true,
  modifiedAt: true,
  userId: true,
  isDeleted: true,
  deletedAt: true,
  pages: {
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  },
} satisfies Prisma.CollectionSelect;

export default async function pagesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "POST") {
    const { collectionName } = req.body;

    if (!collectionName || typeof collectionName !== "string")
      return res.status(400).json({ message: "Bad Request" });

    try {
      const newCollection = await prisma.collection.create({
        data: {
          collectionName: collectionName,
          userId: session.accountId,
        },
        select: collectionSelect,
      });

      const childPageIds = newCollection.pages.map((page) => page.id);
      const responseData = { ...newCollection, pages: childPageIds };

      return res.status(201).json(responseData);
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  if (req.method === "GET") {
    try {
      const collections = await prisma.collection.findMany({
        where: {
          userId: session.accountId,
          isDeleted: false,
        },
        select: collectionSelect,
        orderBy: {
          createdAt: "asc",
        },
      });

      const responseData = collections.map((collection) => {
        const childPageIds = collection.pages.map((page) => page.id);
        return { ...collection, pages: childPageIds };
      });

      return res.status(200).json(responseData);
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
