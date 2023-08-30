import serverTypesenseClient from "../typesense/typesense-client";
import { prisma } from "../lib/prismadb";
import typesenseCollectionSchema from "../typesense/typesense-collection-schema";

// TODO: Tidy up server init
const checkFirstStart = async () => {
  const isFirstStart = await prisma.globalSetting.findUnique({
    where: { key: "isFirstStart" },
  });

  if (!isFirstStart || isFirstStart.value === "true") {
    try {
      console.log("Creating new typesense collection...");

      const isTypesenseDBExists = await serverTypesenseClient
        .collections("pages")
        .exists();

      if (isTypesenseDBExists)
        await serverTypesenseClient.collections("pages").delete();

      await serverTypesenseClient
        .collections()
        .create(typesenseCollectionSchema);
      console.log("Created collection");

      // TODO: add update logic for existing collection on version upgrade
      await prisma.globalSetting.upsert({
        where: { key: "isFirstStart" },
        update: { value: "false" },
        create: { key: "isFirstStart", value: "false" },
      });
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log("Using existing typesense collection");
  }
};

export default checkFirstStart;
