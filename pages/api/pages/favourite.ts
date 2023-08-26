import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";
import { pageSelect } from ".";

const favouritePagesHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).end();

  if (req.method === "GET") {
    try {
      const favouritePages = await prisma.page.findMany({
        where: {
          userId: session.accountId,
          isFavourite: true,
          isDeleted: false,
        },
        select: pageSelect,
        orderBy: {
          createdAt: "asc",
        },
      });

      const response = favouritePages.map((page) => {
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

export default favouritePagesHandler;
