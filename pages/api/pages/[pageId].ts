import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";
import path from "path";
import fs from "fs";

import serverTypesenseClient from "@/typesense/typesense-client";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prismadb";
import { pageSelect } from "./index";
import { Prisma } from "@prisma/client";
import {
  isStringOrUndefined,
  isDateStringOrUndefined,
  isNullOrUndefinedOrString,
  isBooleanOrUndefined,
} from "@/utils/typeGuards";
import typesensePageDocument from "@/types/typesense-page-document";

const pageSelectWithTextContent = {
  ...pageSelect,
  textContent: true,
  childPages: {
    select: {
      id: true,
      pageName: true,
      userId: true,
      isFavourite: true,
      textContent: true,
      createdAt: true,
      modifiedAt: true,
    },
  },
} satisfies Prisma.PageSelect;

const pageAPIHandler: NextApiHandler = async (req, res) => {
  const { pageId } = req.query;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();
  if (!pageId || typeof pageId !== "string") return res.status(400).end();

  if (req.method === "PATCH") {
    const { pageName, parentId, isFavourite, isDeleted, accessedAt } = req.body;

    if (!isStringOrUndefined(pageName)) return res.status(400).end();
    if (!isNullOrUndefinedOrString(parentId)) return res.status(400).end();
    if (!isBooleanOrUndefined(isFavourite)) return res.status(400).end();
    if (!isBooleanOrUndefined(isDeleted)) return res.status(400).end();
    if (!isDateStringOrUndefined(accessedAt)) return res.status(400).end();

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
          parentId: parentId,
          modifiedAt: new Date(),
          isFavourite: isFavourite,
          isDeleted: isDeleted,
          deletedAt: isDeleted ? new Date() : undefined,
          accessedAt: accessedAt ? new Date(Date.parse(accessedAt)) : undefined,
        },
        select: pageSelectWithTextContent,
      });

      if (typeof isDeleted !== "undefined") {
        await prisma.page.updateMany({
          where: {
            userId: session.accountId,
            parentId: pageId,
          },
          data: {
            isDeleted: isDeleted,
            deletedAt: isDeleted ? new Date() : undefined,
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

      // Update page in typesense db
      if (typeof isDeleted === "undefined") {
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

          updatedPage.childPages.map(async (page) => {
            await serverTypesenseClient
              .collections("pages")
              .documents(page.id)
              .delete();
          });
        } else {
          // and add it back on restore
          await serverTypesenseClient
            .collections("pages")
            .documents()
            .upsert(typesensePage);

          updatedPage.childPages.forEach(async (page) => {
            const typesensePage: typesensePageDocument = {
              id: page.id,
              userId: page.userId,
              pageName: page.pageName,
              pageTextContent: page.textContent,
              pageCreatedAt: page.createdAt.getTime(),
              pageModifiedAt: page.modifiedAt.getTime(),
              isFavourite: page.isFavourite,
            };

            await serverTypesenseClient
              .collections("pages")
              .documents()
              .upsert(typesensePage);
          });
        }
      }

      const { Page, ...response } = {
        ...updatedPage,
        childPages: updatedPage.childPages.map((page) => page.id),
        parentPageName: updatedPage.Page ? updatedPage.pageName : null,
      };

      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).end();
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

      const uploadDir = path.join(process.cwd(), "uploads", session.accountId);
      deletedPage.files.forEach(async (file) => {
        fs.rm(path.join(uploadDir, file.fileName), (err) => {
          if (err) throw err;
        });
      });

      await serverTypesenseClient
        .collections("pages")
        .documents(deletedPage.id)
        .delete();

      deletedPage.childPages.forEach(async (page) => {
        await serverTypesenseClient
          .collections("pages")
          .documents(page.id)
          .delete();
      });

      return res.status(204).end();
    } catch (err) {
      return res.status(500).end();
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

      if (!page) return res.status(404).end();

      const { Page, ...response } = {
        ...page,
        childPages: page.childPages.map((page) => page.id),
        parentPageName: page.Page ? page.pageName : null,
      };

      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).end();
    }
  }

  return res.status(405).end();
};

export default pageAPIHandler;
