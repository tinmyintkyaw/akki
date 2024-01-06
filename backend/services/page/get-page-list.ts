import { db } from "@/configs/kysely.js";
import { selectArray } from "@/services/page/page-select.js";
import { sql } from "kysely";

export const getPageList = async (userId: string) => {
  /**
   * Equivalent SQL
   *
   * SELECT
   *     "id",
   *     "page_name",
   *     "user_id",
   *     "deleted_at",
   *     (
   *         SELECT
   *             array_agg("page2"."id") AS "children"
   *         FROM
   *             "page" as "page2"
   *         WHERE
   *             "page2"."path" ~ (page.path::text || '.*{1}')::lquery
   *     ) as "children"
   * FROM
   *     "page"
   * WHERE
   *     "user_id" = $ 1
   *     AND "deleted_at" IS null
   * ORDER BY
   *     "accessed_at" asc
   */

  const pageList = await db
    .selectFrom("page")
    .select(({ selectFrom }) => [
      ...selectArray,
      selectFrom("page as page2")
        .select(({ fn }) => [
          fn.agg<string[]>("array_agg", ["page2.id"]).as("children"),
        ])
        .where(
          "page2.path",
          "~",
          sql.raw("(page.path::text || '.*{1}')::lquery"),
        )
        .as("children"),
    ])
    .where("user_id", "=", userId)
    .where("deleted_at", "is", null)
    .orderBy("created_at asc")
    .execute();

  return pageList;
};

export const getRecentPageList = async (userId: string) => {
  const recentPageList = await db
    .selectFrom("page")
    .select(["id", "page_name", "user_id"])
    .where("user_id", "=", userId)
    .where("deleted_at", "is", null)
    .orderBy("accessed_at desc")
    .limit(10)
    .execute();

  return recentPageList;
};
