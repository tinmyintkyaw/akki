import * as Y from "yjs";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prismadb";
import serverTypesenseClient, {
  typesensePageDocument,
} from "@/typesense/typesense-client";

export default async function pagesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "POST") {
    const { pageName, collectionId } = req.body;

    if (!pageName || typeof pageName !== "string")
      return res.status(400).json({ message: "Bad Request" });

    if (!collectionId || typeof collectionId !== "string")
      return res.status(400).json({ message: "Bad Request" });

    try {
      const newPage = await prisma.page.create({
        data: {
          userId: session.accountId,
          pageName: pageName,
          collectionId: collectionId,
          ydoc: Buffer.from(Y.encodeStateAsUpdate(new Y.Doc())),
          textContent: "",
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
        },
      });

      const typesensePage: typesensePageDocument = {
        id: newPage.id,
        userId: newPage.userId,
        pageName: newPage.pageName,
        pageTextContent: "",
        pageCreatedAt: newPage.createdAt.getTime(),
        pageModifiedAt: newPage.modifiedAt.getTime(),
        isFavourite: newPage.isFavourite,
      };

      await serverTypesenseClient
        .collections("pages")
        .documents()
        .create(typesensePage);

      return res.status(201).json(newPage);
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  if (req.method === "GET") {
    try {
      const pages = await prisma.page.findMany({
        where: {
          userId: session.accountId,
          isDeleted: false,
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
        },
      });

      return res.status(200).json(pages);
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
