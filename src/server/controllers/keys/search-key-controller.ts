import { typesenseClient } from "@/index";
import { RequestHandler } from "express";

const generateScopedSearchKey = (
  typesenseKey: string,
  userId: string,
  expiresAt: number,
) => {
  return typesenseClient.keys().generateScopedSearchKey(typesenseKey, {
    filter_by: `userId:${userId}`,
    expires_at: expiresAt,
  });
};

export const searchKeyController: RequestHandler = async (req, res) => {
  if (!res.locals.session) throw new Error();

  const scopedSearchKey = generateScopedSearchKey(
    res.locals.session.typesenseKeyValue,
    res.locals.session.user.userId,
    Date.now() + 15 * 60 * 1000, // 15 min
  );
  return res.status(200).json({
    searchKey: scopedSearchKey,
  });
};
