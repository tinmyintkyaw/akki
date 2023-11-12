import logger from "@/configs/logger-config";
import typesenseClient from "@/configs/typesense-client-config";
import typesenseCollectionSchema from "@/utils/typesense-collection-schema";

async function checkTypesenseDB() {
  try {
    logger.info("Checking for existing collection");
    const typesenseCollectionExists = await typesenseClient
      .collections("pages")
      .exists();

    if (!typesenseCollectionExists) {
      logger.info("Collection not found, creating...");
      await typesenseClient.collections().create(typesenseCollectionSchema);
      logger.info("Created collection!");
    } else {
      logger.info("Collection found!");
    }
  } catch (error) {
    process.exit(1);
  }
}

export default checkTypesenseDB;
