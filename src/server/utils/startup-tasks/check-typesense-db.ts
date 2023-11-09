import typesenseClient from "@/configs/typesense-client-config";
import typesenseCollectionSchema from "@/utils/typesense-collection-schema";

async function checkTypesenseDB() {
  try {
    console.log("Checking for existing collection");
    const typesenseCollectionExists = await typesenseClient
      .collections("pages")
      .exists();

    if (!typesenseCollectionExists) {
      console.log("Collection not found, creating...");
      await typesenseClient.collections().create(typesenseCollectionSchema);
      console.log("Created collection!");
    } else {
      console.log("Collection found!");
    }
  } catch (error) {
    process.exit(1);
  }
}

export default checkTypesenseDB;
