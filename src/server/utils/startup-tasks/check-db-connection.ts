import logger from "@/configs/logger-config";
import prisma from "@/configs/prisma-client-config";
import { Prisma } from "@prisma/client";

async function checkDBConnection() {
  try {
    await prisma.$connect();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      logger.error("Cannot connect to DB");
    }
    process.exit(1);
  }
}

export default checkDBConnection;
