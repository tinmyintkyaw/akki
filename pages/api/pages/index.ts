import * as Y from "yjs";
import { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { Prisma } from "@prisma/client";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prismadb";
import serverTypesenseClient from "@/typesense/typesense-client";
import { isNullOrUndefinedOrString } from "@/utils/typeGuards";
import typesensePageDocument from "@/types/typesense-page-document";

export const pageSelect = {
  id: true,
  pageName: true,
  isFavourite: true,
  createdAt: true,
  accessedAt: true,
  modifiedAt: true,
  userId: true,
  isDeleted: true,
  deletedAt: true,
  parentId: true,
  childPages: {
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
  files: {
    select: {
      id: true,
      fileName: true,
    },
  },
  Page: {
    select: {
      pageName: true,
    },
  },
} satisfies Prisma.PageSelect;

const pagesAPIHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).end();

  if (req.method === "POST") {
    const { pageName, parentId } = req.body;

    if (typeof pageName !== "string") return res.status(400).end();
    if (!isNullOrUndefinedOrString(parentId)) return res.status(400).end();

    try {
      const newPage = await prisma.page.create({
        data: {
          userId: session.accountId,
          pageName: pageName,
          parentId: parentId,
          ydoc: Buffer.from(Y.encodeStateAsUpdate(new Y.Doc())),
          textContent: "",
        },
        select: pageSelect,
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

      const { Page, ...response } = {
        ...newPage,
        childPages: newPage.childPages.map((page) => page.id),
        parentPageName: newPage.Page ? newPage.pageName : null,
      };

      return res.status(201).json(response);
    } catch (err) {
      return res.status(500).end();
    }
  }

  if (req.method === "GET") {
    try {
      const pages = await prisma.page.findMany({
        where: {
          userId: session.accountId,
          isDeleted: false,
        },
        select: pageSelect,
        orderBy: {
          createdAt: "asc",
        },
      });

      const response = pages.map((page) => {
        const { Page, ...response } = {
          ...page,
          childPages: page.childPages.map((page) => page.id),
          parentPageName: page.Page ? page.Page.pageName : null,
        };

        return response;
      });

      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).end();
    }
  }

  return res.status(405).end();
};

export default pagesAPIHandler;
