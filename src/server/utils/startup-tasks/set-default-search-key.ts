import redisClient from "@/configs/ioredis-config";
import prisma from "@/configs/prisma-client-config";
import typesenseClient from "@/configs/typesense-client-config";

async function setDefaultSearchKey() {
  try {
    const dbGlobalVars = await prisma.globalVariables.findFirst({
      where: {
        id: 0,
      },
    });

    if (!dbGlobalVars) {
      const newDefaultSearchKey = await typesenseClient.keys().create({
        description: "",
        actions: ["documents:search"],
        collections: ["pages"],
      });

      const newGlobalVars = await prisma.globalVariables.create({
        data: {
          id: 0,
          search_key_id: newDefaultSearchKey.id.toString(),
          search_key_value: newDefaultSearchKey.value,
        },
      });

      await redisClient.set(
        "search:defaultKey",
        newGlobalVars.search_key_value,
      );
    } else {
      await redisClient.set("search:defaultKey", dbGlobalVars.search_key_value);
    }
  } catch (error) {
    process.exit(1);
  }
}

export default setDefaultSearchKey;
