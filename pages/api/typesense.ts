import type { NextApiRequest, NextApiResponse } from "next";

import serverTypesenseClient, {
  typesensePageDocument,
} from "@/typesense/typesense-client";
import prisma from "@/lib/prismadb";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const test = await serverTypesenseClient
    .collections("pages")
    .documents()
    .search({
      q: "go",
      query_by: "pageName",
      filter_by: `pageCreatedAt:<1680083274939`,
    });
  res.status(200).json({ message: test });

  // await typesense
  //   .collections("pages")
  //   .documents()
  //   .delete({ filter_by: `userId:${session?.accountId}}` });

  // const pages = await prisma.page.findMany({
  //   where: { userId: session?.accountId },
  //   select: {
  //     pageName: true,
  //     id: true,
  //     createdAt: true,
  //     modifiedAt: true,
  //     isFavorite: true,
  //     textContent: true,
  //   },
  // });

  // const dbPages: typesensePageDocument[] = pages.map((page) => {
  //   return {
  //     id: page.id,
  //     pageName: page.pageName,
  //     pageTextContent: page.textContent as string,
  //     isFavorite: page.isFavorite,
  //     pageCreatedAt: page.createdAt.getTime(),
  //     pageModifiedAt: page.modifiedAt.getTime(),
  //     userId: session?.accountId as string,
  //   };
  // });

  // console.log({ pages, dbPages });

  // try {
  //   const test = await typesense
  //     .collections("pages")
  //     .documents()
  //     .import(dbPages, { action: "upsert" });
  //   console.log(test);
  //   res.status(200).json({ message: test });
  // } catch (err) {
  //   res.status(404).json({ err: err.importResults });
  // }
}
