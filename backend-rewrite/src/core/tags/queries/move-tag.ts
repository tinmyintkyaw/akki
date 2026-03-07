import { Database } from "@/db/database";
import { Kysely, sql } from "kysely";

const moveTagQuery = (
  db: Kysely<Database>,
  options: { tagId: string; parentId: string },
) => {
  const { tagId, parentId } = options;

  return db
    .with("paths", (db) =>
      db.selectNoFrom((eb) => [
        eb
          .selectFrom("tag")
          .select("path")
          .where("id", "=", tagId)
          .limit(1)
          .as("curr_path"),
        eb
          .selectFrom("tag")
          .select("path")
          .where("id", "=", parentId)
          .limit(1)
          .as("new_parent_path"),
      ]),
    )
    .updateTable("tag")
    .set({
      path: sql`
      (select new_parent_path from paths) ||
      subpath(path, nlevel(subpath((SELECT curr_path FROM paths), 0, -1)))
      `,
    })
    .where("tag.path", "<@", (eb) => eb.selectFrom("paths").select("curr_path"))
    .where((eb) =>
      eb.not(
        eb(
          eb.selectFrom("paths").select("new_parent_path"),
          "<@",
          eb.selectFrom("paths").select("curr_path"),
        ),
      ),
    );
};

export { moveTagQuery };
