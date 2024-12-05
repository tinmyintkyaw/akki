import { db } from "@/db/kysely.js";
import { fetchPayload } from "@hocuspocus/server";

export const getPageHandler = async (data: fetchPayload) => {
  const page = await db
    .selectFrom("Page")
    .select("ydoc")
    .where("id", "=", data.documentName)
    .where("userId", "=", data.context.userId)
    .executeTakeFirstOrThrow();

  return page.ydoc;
};
