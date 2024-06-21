import { db } from "@/db/kysely.js";
import { selectArray } from "@/pages/utils/page-select.js";
import { transformPageListForClient } from "@/pages/utils/transform-for-client.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { sql } from "kysely";

const requestHandler: RequestHandler = async (req, res) => {
  const { userId } = res.locals.session;

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

  const response = transformPageListForClient(pageList);
  return res.status(200).json(response);
};

export const getPageListController = asyncHandler(requestHandler);
