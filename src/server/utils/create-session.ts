import redisClient from "@/configs/ioredis-config";
import { auth } from "@/configs/lucia-config";
import meilisearchClient from "@/configs/meilisearch-client-config";

/**
 * Generates a new session object
 * @param userId
 * @returns Session
 */
const createSession = async (userId: string) => {
  // defaultSearchKey has already been loaded into Redis db at app startup
  const defaultSearchKeyId = await redisClient.get("search:keyId");
  const defaultSearchKeyValue = await redisClient.get("search:keyValue");

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

export default createSession;
