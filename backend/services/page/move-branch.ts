import { db } from "@/configs/kysely.js";
import { Page } from "@/types/database.js";
import { sql } from "kysely";

export const moveBranch = async (pageId: string, parentId: string | null) => {
  if (typeof parentId === "string" && pageId === parentId)
    throw new Error("Page cannot be nested to itself");

  type QueryResult = Omit<Page, "ydoc">;
  const query = await db.executeQuery<QueryResult>(
    sql`
    with query as (
      select
        ${
          typeof parentId === "string"
            ? sql`parent.path as parent_path,`
            : sql``
        }
        subpath(page.path, nlevel(branch.path) - 1) as branch,
        page.id
      from
        page
        left join page as branch on branch.id = ${pageId}
        ${
          typeof parentId === "string"
            ? sql`left join page as parent on parent.id = ${parentId}`
            : sql``
        }
      where
        page.path ~ ('*.' || ${pageId} || '.*')::lquery
    )
    update 
      page 
    set 
      path = ${
        typeof parentId === "string"
          ? sql`(query.parent_path || query.branch)::ltree`
          : sql`(query.branch)::ltree`
      }
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
//       .leftJoin("page as branch", (eb) => eb.on("branch.id", "=", pageId))
//       .select([
//         "page.id",
//         "page.modified_at",
//         sql`subpath(page.path, nlevel(branch.path) - 1)`.as("branch"),
//       ])
//       .$if(parentId !== null && pageId !== parentId, (qb) =>
//         qb
//           .leftJoin("page as parent", (eb) =>
//             eb.on("parent.id", "=", parentId),
//           )
//           .select("parent.path as parent_path"),
//       )
//       .where(sql`page.path ~ ('*.' || ${pageId} || '.*')::lquery`),
//   )
//   .updateTable("page")
//   .from("query")
//   .$if(parentId === null || pageId === parentId, (qb) =>
//     qb.set({
//       path: sql`(query.branch)::ltree`,
//     }),
//   )
//   .$if(parentId !== null && pageId !== parentId, (qb) =>
//     qb.set({
//       path: sql`(query.parent_path || query.branch)::ltree`,
//     }),
//   )
//   .where("query.id", "=", (eb) => eb.ref("page.id"))
//   .returningAll()
//   .execute();
