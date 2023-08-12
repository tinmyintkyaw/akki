import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import serverTypesenseClient from "@/typesense/typesense-client";
import { prisma } from "@/lib/prismadb";

export default async function searchKeyHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: session.accountId,
        },
        select: {
          typesenseKey: true,
          typesenseKeyId: true,
        },
      });

      const generateScopedSearchKey = (typesenseKey: string) =>
        serverTypesenseClient.keys().generateScopedSearchKey(typesenseKey, {
          filter_by: `userId:${session.accountId}`,
          expires_at: Date.now() + 60 * 60 * 1000,
        });

      let scopedSearchOnlyKey = "";

      if (user.typesenseKey && user.typesenseKeyId) {
        scopedSearchOnlyKey = generateScopedSearchKey(user.typesenseKey);
      } else {
        const newTypesenseKey = await serverTypesenseClient.keys().create({
          description: `Search only key for user ${session.accountId}`,
          actions: ["documents:search"],
          collections: ["pages"],
        });

        if (!newTypesenseKey) return res.status(500).end();

        const updatedUser = await prisma.user.update({
          where: {
            id: session.accountId,
          },
          data: {
            typesenseKey: newTypesenseKey.value,
            typesenseKeyId: newTypesenseKey.id,
          },
          select: {
            typesenseKey: true,
            typesenseKeyId: true,
          },
        });

        if (!updatedUser.typesenseKey || updatedUser.typesenseKeyId)
          return res.status(500).end();

        scopedSearchOnlyKey = generateScopedSearchKey(updatedUser.typesenseKey);
      }

      return res.status(200).json({ key: scopedSearchOnlyKey });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
