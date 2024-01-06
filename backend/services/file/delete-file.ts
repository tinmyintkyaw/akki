import { db } from "@/configs/kysely.js";
import fs from "fs/promises";
import path from "path";

export const deleteFile = async (fileId: string, userId: string) => {
  const file = await db
    .deleteFrom("file")
    .where("id", "=", fileId)
    .where("user_id", "=", userId)
    .returningAll()
    .executeTakeFirstOrThrow();

  const filePath = path.join(
    process.cwd(),
    "uploads",
    userId,
    `${file.id}.${file.extension}`,
  );

  fs.unlink(filePath);
};
