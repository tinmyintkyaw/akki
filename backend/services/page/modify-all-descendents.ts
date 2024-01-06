import { db } from "@/configs/kysely.js";
import { updatePagePayloadSchema } from "@/schemas/page-schema.js";
import { Page } from "@/types/database.js";
import { sql } from "kysely";
import { z } from "zod";

export const modifyAllDescendents = async (
  pageId: string,
  payload: z.infer<typeof updatePagePayloadSchema>,
) => {
  type QueryResult = Omit<Page, "ydoc">;

  const query = await db.executeQuery<QueryResult>(
    sql`
    with query as (
      select
        page.id
      from
        page
      where
        page.path ~ ('*.' || ${pageId} || '.*')::lquery
    )
    update
      page
    set
      deleted_at = ${payload.deletedAt}
    from
      query
    where
      query.id = page.id
    returning
      page.id,
      page.page_name, 
      page.path,
      page.is_starred,
      page.created_at,
      page.modified_at,
      page.accessed_at,
      page.deleted_at,
      page.user_id
  `.compile(db),
  );

  return query.rows;
};

// return await db
//   .with("query", (db) =>
//     db
//       .selectFrom("page")
//       .select(selectArray)
//       .where(sql`page.path ~ ('*.' || ${pageId} || '.*')::lquery`),
//   )
//   .updateTable("page")
//   .from("query")
//   .set({ deleted_at: payload.deletedAt })
//   .where("query.id", "=", (eb) => eb.ref("page.id"))
//   .returningAll()
//   .execute();
