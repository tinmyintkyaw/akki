import { db } from "@/configs/kysely.js";
import { selectArray } from "@/services/page/page-select.js";

export const getDeletedPageList = async (userId: string) => {
  const deletedPageList = await db
    .selectFrom("page")
    .select(selectArray)
    .where("user_id", "=", userId)
    .where("deleted_at", "is not", null)
    .orderBy("deleted_at desc")
    .execute();

  return deletedPageList;
};
