import { auth } from "@/configs/lucia.js";
import { db } from "@/db/kysely.js";
import { parsedProcessEnv } from "@/env-vars/env-variables.js";
import { logger } from "@/logger/index.js";

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

    logger.info("Created demo user");
  } catch (error) {
    logger.error("Error creating a demo user");
    process.exit(1);
  }
};

const removeDemoUser = async () => {
  try {
    const demoUser = await db
      .selectFrom("user")
      .selectAll()
      .where("username", "=", "demo")
      .executeTakeFirst();

    if (!demoUser) return;

    logger.info("Existing demo user detected, removing...");
    await auth.deleteUser(demoUser.id);
  } catch (error) {
    logger.error("Error deleting demo user");
    process.exit(1);
  }
};

async function checkDemoMode() {
  logger.debug("Checking if running in demo mode");
  if (parsedProcessEnv.DEMO_MODE === "true") {
    logger.info("Demo mode detected - creating a new demo user");
    await createDemoUser();
  } else {
    await removeDemoUser();
  }
}

export { checkDemoMode };
