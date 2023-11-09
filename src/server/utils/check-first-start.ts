import prisma from "@/configs/prisma-client-config";
import typesenseClient from "@/configs/typesense-client-config";
import { auth } from "@/lucia.js";
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

  if (parseInt(process.env.DEMO_MODE) === 1) {
    console.log("Demo mode detected - creating a new demo user");

    try {
      await auth.createUser({
        key: {
          providerId: "username",
          providerUserId: "demo",
          password: "demo",
        },
        attributes: {
          name: "Demo User",
          username: "demo",
        },
      });

      await typesenseClient.keys().create({
        description: `search-only key for demo user`,
        actions: ["documents:search"],
        collections: ["pages"],
      });

      console.log("Created demo user");
    } catch (error) {
      console.error("Error creating a demo user");
      process.exit(1);
    }
  } else {
    try {
      const demoUser = await prisma.user.findUnique({
        where: { username: "demo" },
      });

      demoUser && (await auth.deleteUser(demoUser.id));
    } catch (error) {
      console.error("Error deleting demo user");
      process.exit(1);
    }
  }
};

export default checkFirstStart;
