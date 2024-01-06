import { db } from "@/configs/kysely.js";
import { selectArray } from "@/services/page/page-select.js";

export const getPage = async (pageId: string, userId: string) => {
  const page = await db
    .selectFrom("page")
    .select(selectArray)
    .where("id", "=", pageId)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  return page;
};
