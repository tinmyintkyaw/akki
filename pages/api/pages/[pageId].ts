import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prismadb";

export default async function pageHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pageId } = req.query;

  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (!pageId || typeof pageId !== "string")
    return res.status(400).json({ message: "Bad Request" });

  if (req.method === "PUT") {
    const { pageName, parentPageId } = req.body;
    // TODO: Addd ability to change parent page & child pages

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
        },
      });

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
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
      });

      res.status(204).json(data);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  try {
    const data = await prisma.page.findUnique({
      where: {
        id_userId: {
          userId: session.accountId,
          id: pageId,
        },
      },
    });

    if (!data) return res.status(404).json({ message: "Not Found" });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
