import { redisClient } from "@/configs/ioredis.js";
import { db } from "@/db/kysely.js";
import { logger } from "@/logger/index.js";
import { meilisearchClient } from "@/search/meilisearch.js";

const addSearchKeyToRedis = async (keyID: string, keyValue: string) => {
  await redisClient.set("search:keyId", keyID);
  await redisClient.set("search:keyValue", keyValue);
};

async function commitMeilisearchCredentialsToRedis() {
  try {
    const dbGlobalVars = await db
      .selectFrom("global_variable")
      .selectAll()
      .where("id", "=", 0)
      .executeTakeFirst();

    if (!dbGlobalVars) {
      const newDefaultSearchKey = await meilisearchClient.createKey({
        description: "default search key",
        actions: ["search"],
        indexes: ["pages"],
        expiresAt: null,
      });

      const newGlobalVars = await db
        .insertInto("global_variable")
        .values({
          id: 0,
          search_key_id: newDefaultSearchKey.uid,
          search_key_value: newDefaultSearchKey.key,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      const { search_key_id, search_key_value } = newGlobalVars;
      await addSearchKeyToRedis(search_key_id, search_key_value);
    } else {
      const { search_key_id, search_key_value } = dbGlobalVars;
      await addSearchKeyToRedis(search_key_id, search_key_value);
    }
    logger.debug("Imported default search key into redis");
  } catch (error) {
    logger.error("Error");
    process.exit(1);
  }
}

export { commitMeilisearchCredentialsToRedis };
