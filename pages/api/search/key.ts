import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import serverTypesenseClient from "@/typesense/typesense-client";

export default async function searchKeyHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    try {
      const searchOnlyKey = await serverTypesenseClient.keys().create({
        description: `Search only key for user ${session.accountId}`,
        actions: ["documents:search"],
        collections: ["pages"],
        expires_at: Date.now() + 1000 * 60 * 60 * 3,
      });

      if (!searchOnlyKey.value)
        return res.status(500).json({ message: "Error" });

      const scopedSearchOnlyKey = serverTypesenseClient
        .keys()
        .generateScopedSearchKey(searchOnlyKey.value, {
          filter_by: `userId:${session.accountId}`,
        });

      return res.status(200).json({ key: scopedSearchOnlyKey });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
