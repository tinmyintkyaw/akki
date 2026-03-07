import { tagSelect } from "@/core/tags/queries/tag-select";
import { Database } from "@/db/database";
import { Kysely, sql } from "kysely";

export const getTag = (
  db: Kysely<Database>,
  opts: { userId: string; spaceId: string; tagId?: string },
) => {
  let query = db
    .selectFrom("tag")
    .select([
      ...tagSelect,
      sql<
        string[]
      >`coalesce(array_agg(child.id) filter(where child.id is not null), '{}')`.as(
        "children",
      ),
    ])
    .leftJoin("tag as child", (join) =>
      join
        .on("child.path", "<@", (eb) => eb.ref("tag.path"))
        .on(sql`nlevel(child.path)`, "=", sql`nlevel(tag.path) + 1`),
    )
    .where("tag.spaceId", "=", opts.spaceId)
    .groupBy("tag.id")
    .orderBy("tag.id");

  if (opts.tagId) query = query.where("tag.id", "=", opts.tagId);

  return query;
};
