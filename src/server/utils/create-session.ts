import redisClient from "@/configs/ioredis-config";
import { auth } from "@/configs/lucia-config";
import typesenseClient from "@/configs/typesense-client-config";

/**
 * Generates a new session object
 * @param userId
 * @returns Session
 */
const createSession = async (userId: string) => {
  // defaultSearchKey has already been loaded into Redis db at app startup
  const defaultSearchKey = await redisClient.get("search:defaultKey");

  const userScopedSearchKey = typesenseClient
    .keys()
    .generateScopedSearchKey(defaultSearchKey, {
      filter_by: `userId:${userId}`,
    });

  return await auth.createSession({
    userId: userId,
    attributes: {
      scoped_search_key: userScopedSearchKey,
    },
  });
};

export default createSession;
