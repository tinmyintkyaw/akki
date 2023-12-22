import redisClient from "@/configs/ioredis-config";
import logger from "@/configs/logger-config";
import meilisearchClient from "@/configs/meilisearch-client-config";
import prisma from "@/configs/prisma-client-config";

const setSearchKeyToRedis = async (keyID: string, keyValue: string) => {
  await redisClient.set("search:keyId", keyID);
  await redisClient.set("search:keyValue", keyValue);
};

async function setDefaultSearchKey() {
  try {
    const dbGlobalVars = await prisma.globalVariables.findFirst({
      where: {
        id: 0,
      },
    });

    if (!dbGlobalVars) {
      const newDefaultSearchKey = await meilisearchClient.createKey({
        description: "default search key",
        actions: ["search"],
        indexes: ["pages"],
        expiresAt: null,
      });

      const newGlobalVars = await prisma.globalVariables.create({
        data: {
          id: 0,
          search_key_id: newDefaultSearchKey.uid,
          search_key_value: newDefaultSearchKey.key,
        },
      });

      const { search_key_id, search_key_value } = newGlobalVars;
      await setSearchKeyToRedis(search_key_id, search_key_value);
    }

    const { search_key_id, search_key_value } = dbGlobalVars;
    await setSearchKeyToRedis(search_key_id, search_key_value);

    logger.debug("Imported default search key into redis");
  } catch (error) {
    process.exit(1);
  }
}

export default setDefaultSearchKey;
