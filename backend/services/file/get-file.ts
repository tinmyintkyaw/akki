import { db } from "@/configs/kysely.js";
import fs from "fs/promises";
import path from "path";

export const getFile = async (fileId: string, userId: string) => {
  const dbFile = await db
    .selectFrom("file")
    .where("id", "=", fileId)
    .where("user_id", "=", userId)
    .selectAll()
    .executeTakeFirstOrThrow();

  const filePath = path.join(
    process.cwd(),
    "uploads",
    dbFile.user_id,
    dbFile.id,
  );

  await fs.stat(filePath);

  return filePath;
};
