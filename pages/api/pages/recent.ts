import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prismadb";
import { pageSelect } from ".";

const recentPagesHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();

  if (req.method !== "GET") return res.status(405).end();

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

    const response = recentPages.map((page) => ({
      ...page,
      childPages: page.childPages.map((page) => page.id),
    }));

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).end();
  }
};

export default recentPagesHandler;
