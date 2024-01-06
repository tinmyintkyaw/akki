import { db } from "@/configs/kysely.js";
import {} from "multer";
import path from "path";

export const uploadFile = async (
  fileName: string,
  originalFileName: string,
  pageId: string,
  userId: string,
) => {
  const parsedFileName = path.parse(fileName);
  return await db
    .insertInto("file")
    .values({
      id: parsedFileName.name,
      extension: parsedFileName.ext,
      file_name: originalFileName,
      page_id: pageId,
      user_id: userId,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};
