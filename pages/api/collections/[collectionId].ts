import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prismadb";

export default async function pageHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { collectionId } = req.query;

  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (!collectionId || typeof collectionId !== "string")
    return res.status(400).json({ message: "Bad Request" });

  if (req.method === "PATCH") {
    const { collectionName, isFavourite, isDeleted } = req.body;

    if (collectionName && typeof collectionName !== "string")
      return res.status(400).json({ message: "Bad Request" });

    if (typeof isFavourite !== "undefined" && typeof isFavourite !== "boolean")
      return res.status(400).json({ message: "Bad Request" });

    if (typeof isDeleted !== "undefined" && typeof isDeleted !== "boolean")
      return res.status(400).json({ message: "Bad Request" });

    try {
      const updatedCollection = await prisma.collection.update({
        where: {
          id_userId: {
            id: collectionId,
            userId: session.accountId,
          },
        },
        data: {
          collectionName: collectionName,
          isFavourite: isFavourite,
          modifiedAt: new Date(),
          isDeleted: isDeleted,
          deletedAt: isDeleted ? new Date() : undefined,
        },
        select: {
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
          },
        },
      });

      const childPageIds = updatedCollection.pages.map((page) => page.id);
      const responseData = { ...updatedCollection, pages: childPageIds };

      return res.status(200).json(responseData);
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deletedCollection = await prisma.collection.delete({
        where: {
          id_userId: {
            id: collectionId,
            userId: session.accountId,
          },
        },
      });

      return res.status(204).end();
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "GET") {
    try {
      const collection = await prisma.collection.findUnique({
        where: {
          id_userId: {
            userId: session.accountId,
            id: collectionId,
          },
        },
        select: {
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
          },
        },
      });

      if (!collection) return res.status(404).json({ message: "Not Found" });

      const childPageIds = collection.pages.map((page) => page.id);
      const responseData = { ...collection, pages: childPageIds };

      return res.status(200).json(responseData);
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
