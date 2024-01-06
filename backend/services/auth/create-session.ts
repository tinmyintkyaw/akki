import { redisClient } from "@/configs/ioredis.js";
import { auth } from "@/configs/lucia.js";
import { meilisearchClient } from "@/configs/meilisearch.js";

/**
 * Generates a new session object
 * @param userId
 */
const createSession = async (userId: string) => {
  // defaultSearchKey has already been loaded into Redis db at app startup
  const defaultSearchKeyId = await redisClient.get("search:keyId");
  const defaultSearchKeyValue = await redisClient.get("search:keyValue");

  if (!defaultSearchKeyId || !defaultSearchKeyValue) throw new Error();

  const userScopedSearchKey = meilisearchClient.generateTenantToken(
    defaultSearchKeyId,
    {
      pages: { filter: `userId = ${userId}` },
    },
    { apiKey: defaultSearchKeyValue },
  );

  return await auth.createSession({
    userId: userId,
    attributes: {
      scoped_search_key: userScopedSearchKey,
    },
  });
};

export { createSession };
