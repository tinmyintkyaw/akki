import envVars from "@/configs/env-config";
import prisma from "@/configs/prisma-client-config";
import typesenseClient from "@/configs/typesense-client-config";
import { auth } from "@/lucia";

const createDemoUser = async () => {
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
};

const removeDemoUser = async () => {
  try {
    const demoUser = await prisma.user.findUnique({
      where: { username: "demo" },
    });

    if (!demoUser) return;

    console.log("Existing demo user detected, removing...");
    await auth.deleteUser(demoUser.id);
  } catch (error) {
    console.error("Error deleting demo user");
    process.exit(1);
  }
};

async function checkDemoMode() {
  if (envVars.DEMO_MODE) {
    console.log("Demo mode detected - creating a new demo user");
    await createDemoUser();
  } else {
    await removeDemoUser();
  }
}

export default checkDemoMode;
