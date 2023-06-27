import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prismadb";
import serverTypesenseClient, {
  typesensePageDocument,
} from "@/typesense/typesense-client";

export default async function pageHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pageId } = req.query;

  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (!pageId || typeof pageId !== "string")
    return res.status(400).json({ message: "Bad Request" });

  if (req.method === "PATCH") {
    const { pageName, parentPageId, isFavourite } = req.body;

    if (pageName && typeof pageName !== "string")
      return res.status(400).json({ message: "Bad Request" });

    if (parentPageId && typeof parentPageId !== "string")
      return res.status(400).json({ message: "Bad Request" });

    if (typeof isFavourite !== "undefined" && typeof isFavourite !== "boolean")
      return res.status(400).json({ message: "Bad Request" });

    try {
      const data = await prisma.page.update({
        where: {
          id_userId: {
            userId: session.accountId,
            id: pageId,
          },
        },
        data: {
          pageName: pageName,
          parentPageId: parentPageId,
          modifiedAt: new Date(),
          isFavourite: isFavourite,
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
        .upsert(typesensePage);

      const { textContent, ...responseData } = data;

      return res.status(200).json(responseData);
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const data = await prisma.page.delete({
        where: {
          id_userId: {
            userId: session.accountId,
            id: pageId,
          },
        },
        select: {
          id: true,
          pageName: true,
          parentPageId: true,
          createdAt: true,
          modifiedAt: true,
        },
      });

      await serverTypesenseClient
        .collections("pages")
        .documents(data.id)
        .delete();

      return res.status(204).end();
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "GET") {
    try {
      const data = await prisma.page.findUnique({
        where: {
          id_userId: {
            userId: session.accountId,
            id: pageId,
          },
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

      if (!data) return res.status(404).json({ message: "Not Found" });

      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
