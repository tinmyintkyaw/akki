import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prismadb";

export default async function recentPagesHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method !== "GET")
    return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const data = await prisma.page.findMany({
      where: {
        userId: session.accountId,
      },
      orderBy: {
        accessedAt: "desc",
      },
      take: 10,
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
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
