import prisma from "@/db/prisma-client.js";
import { typesenseClient } from "@/index.js";
import typesenseCollectionSchema from "./typesense-collection-schema.js";

const checkFirstStart = async () => {
  await prisma.$connect();

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
};

export default checkFirstStart;
