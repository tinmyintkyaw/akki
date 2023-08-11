import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import serverTypesenseClient, {
  typesensePageDocument,
} from "@/typesense/typesense-client";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prismadb";
import { pageSelect } from "./index";
import { Prisma } from "@prisma/client";

const pageSelectWithTextContent = {
  ...pageSelect,
  textContent: true,
} satisfies Prisma.PageSelect;

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
    const { pageName, collectionId, isFavourite, isDeleted, accessedAt } =
      req.body;

    if (pageName && typeof pageName !== "string")
      return res.status(400).json({ message: "Bad Request" });

    if (collectionId && typeof collectionId !== "string")
      return res.status(400).json({ message: "Bad Request" });

    if (typeof isFavourite !== "undefined" && typeof isFavourite !== "boolean")
      return res.status(400).json({ message: "Bad Request" });

    if (typeof isDeleted !== "undefined" && typeof isDeleted !== "boolean")
      return res.status(400).json({ message: "Bad Request" });

    if (
      typeof accessedAt !== "undefined" &&
      typeof accessedAt !== "string" &&
      isNaN(Date.parse(accessedAt))
    )
      return res.status(400).json({ message: "Bad Request" });

    try {
      const updatedPage = await prisma.page.update({
        where: {
          id_userId: {
            userId: session.accountId,
            id: pageId,
          },
        },
        data: {
          pageName: pageName,
          collectionId: collectionId,
          modifiedAt: new Date(),
          isFavourite: isFavourite,
          isDeleted: isDeleted,
          deletedAt: isDeleted ? new Date() : undefined,
          accessedAt:
            typeof accessedAt !== "undefined"
              ? new Date(Date.parse(accessedAt))
              : undefined,
        },
        select: pageSelectWithTextContent,
      });

      // On restoring a page, restore its collection as well
      if (typeof isDeleted !== "undefined" && !isDeleted) {
        await prisma.collection.update({
          where: {
            id_userId: {
              id: updatedPage.collectionId,
              userId: session.accountId,
            },
          },
          data: {
            isDeleted: false,
          },
        });
      }

      const typesensePage: typesensePageDocument = {
        id: updatedPage.id,
        userId: updatedPage.userId,
        pageName: updatedPage.pageName,
        pageTextContent: updatedPage.textContent,
        pageCreatedAt: updatedPage.createdAt.getTime(),
        pageModifiedAt: updatedPage.modifiedAt.getTime(),
        isFavourite: updatedPage.isFavourite,
      };

      if (typeof isDeleted === "undefined") {
        // Update page in typesense db
        await serverTypesenseClient
          .collections("pages")
          .documents()
          .upsert(typesensePage);
      } else {
        if (isDeleted) {
          // Delete the page from typesense db on soft delete
          await serverTypesenseClient
            .collections("pages")
            .documents(updatedPage.id)
            .delete();
        } else {
          // and add it back on restore
          await serverTypesenseClient
            .collections("pages")
            .documents()
            .upsert(typesensePage);
        }
      }

      // transform data for client
      const { textContent, collection, ...responseData } = {
        ...updatedPage,
        collectionName: updatedPage.collection.collectionName,
      };

      return res.status(200).json(responseData);
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deletedPage = await prisma.page.delete({
        where: {
          id_userId: {
            userId: session.accountId,
            id: pageId,
          },
        },
        select: pageSelect,
      });

      await serverTypesenseClient
        .collections("pages")
        .documents(deletedPage.id)
        .delete();

      return res.status(204).end();
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "GET") {
    try {
      const page = await prisma.page.findUnique({
        where: {
          id_userId: {
            userId: session.accountId,
            id: pageId,
          },
        },
        select: pageSelect,
      });

      if (!page) return res.status(404).json({ message: "Not Found" });

      const { collection, ...response } = {
        ...page,
        collectionName: page.collection.collectionName,
      };

      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
