import { redisClient } from "@/configs/ioredis.js";
import { meilisearchClient } from "@/configs/meilisearch.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const requestHandler: RequestHandler = async (req, res) => {
  const { session } = res.locals;

  // defaultSearchKey has already been loaded into Redis db at app startup
  const defaultSearchKeyId = await redisClient.get("search:keyId");
  const defaultSearchKeyValue = await redisClient.get("search:keyValue");

  if (!defaultSearchKeyId || !defaultSearchKeyValue) throw new Error();

  const searchToken = meilisearchClient.generateTenantToken(
    defaultSearchKeyId,
    {
      pages: { filter: `userId = ${session.user.userId}` },
    },
    {
      apiKey: defaultSearchKeyValue,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  );

  return res.status(200).json({ searchToken: searchToken });
};

export const searchTokenController = asyncHandler(requestHandler);
