import * as Y from "yjs";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import createPageTree from "@/utils/createPageTree";
import prisma from "@/lib/prismadb";
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
    const { pageName, parentPageId } = req.body;

    if (!pageName || typeof pageName !== "string")
      return res.status(400).json({ message: "Bad Request" });

    if (parentPageId && typeof parentPageId !== "string")
      return res.status(400).json({ message: "Error" });

    try {
      const data = await prisma.page.create({
        data: {
          userId: session.accountId,
          pageName: pageName,
          parentPageId: parentPageId,
          ydoc: Buffer.from(Y.encodeStateAsUpdate(new Y.Doc())),
          textContent: "",
        },
        select: {
          id: true,
          pageName: true,
          parentPageId: true,
          createdAt: true,
          modifiedAt: true,
          isFavourite: true,
          userId: true,
          textContent: true,
        },
      });

      const typesensePage: typesensePageDocument = {
        id: data.id,
        userId: data.userId,
        pageName: data.pageName,
        pageTextContent: data.textContent,
        pageCreatedAt: data.createdAt.getTime(),
        pageModifiedAt: data.modifiedAt.getTime(),
        isFavourite: data.isFavourite,
      };

      await serverTypesenseClient
        .collections("pages")
        .documents()
        .create(typesensePage);

      const { textContent, ...responseData } = data;

      return res.status(201).json(responseData);
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  if (req.method === "GET") {
    try {
      const data = await prisma.page.findMany({
        where: {
          userId: session.accountId,
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
        orderBy: {
          createdAt: "asc",
        },
      });

      const pageTree = createPageTree(data, null);

      return res.status(200).json(pageTree);
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
