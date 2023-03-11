import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async function prismaHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const data = await prisma.page.create({
  //   data: {
  //     pageName: "another nested",
  //     parentPageId: "clew448cn0001xdhtk24y8f9e",
  //     userId: "clevkaop80000xdev261x1u4p",
  //     ydoc: new Buffer("YDoc"),
  //   },
  // });

  const data = await prisma.page.findMany({
    where: {
      userId: "clevkaop80000xdev261x1u4p",
      parentPageId: null,
    },
    select: {
      pageName: true,
      id: true,
      // parentDocumentId: true,
    },
  });

  res.status(200).json(data);
}
