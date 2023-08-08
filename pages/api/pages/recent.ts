import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prismadb";
import { pageSelect } from ".";

export default async function recentPagesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method !== "GET")
    return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const recentPages = await prisma.page.findMany({
      where: {
        userId: session.accountId,
        isDeleted: false,
      },
      orderBy: {
        accessedAt: "desc",
      },
      take: 10,
      select: pageSelect,
    });

    const response = recentPages.map((page) => {
      const { collection, ...transformedPage } = {
        ...page,
        collectionName: page.collection.collectionName,
      };
      return transformedPage;
    });

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
