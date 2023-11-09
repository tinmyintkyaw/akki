import typesenseClient from "@/configs/typesense-client-config";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

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

const searchKeyReqController: RequestHandler = async (_req, res) => {
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

export default asyncHandler(searchKeyReqController);
