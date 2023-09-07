import typesenseClient from "@/db/typesense-client.js";
import { RequestHandler } from "express";

const getSearchAPIKeyController: RequestHandler = async (_req, res, next) => {
  const { session } = res.locals;

  try {
    const scopedSearchKey = typesenseClient
      .keys()
      .generateScopedSearchKey(session.user.searchKey, {
        filter_by: `userId:${session.user.userId}`,
        expires_at: session.idlePeriodExpiresAt.getTime(),
      });

    return res.status(200).json({ key: scopedSearchKey });
  } catch (error) {
    next(error);
  }
};

export default getSearchAPIKeyController;
