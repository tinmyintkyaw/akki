import { db } from "@/configs/kysely.js";
import { meilisearchClient } from "@/configs/meilisearch.js";
import { File } from "@/types/database.js";
import fs from "fs/promises";
import { sql } from "kysely";
import path from "path";

export const deletePage = async (pageId: string, userId: string) => {
  const deletedPage = await db
    .with("pages_to_delete", (db) =>
      db
        .selectFrom("page")
        .leftJoin("file", "file.page_id", "page.id")
        .select((eb) => [
          "page.id",
          eb
            .case()
            .when(eb.fn.count("file.id"), ">", 0)
            .then(
              sql<
                Pick<File, "id" | "extension">[]
              >`array_agg(json_build_object('id', file.id, 'extension', file.extension))`,
            )
            .else(null)
            .end()
            .as("files"),
        ])
        .where(sql`page.path ~ ('*.' || ${pageId} || '.*')::lquery`)
        .where("page.user_id", "=", userId)
        .groupBy(["page.id"]),
    )
    .deleteFrom("page")
    .using("pages_to_delete")
    .where("page.id", "=", (eb) => eb.ref("pages_to_delete.id"))
    .returningAll()
    .execute();

  // Delete all the files related to the page
  deletedPage.forEach(async (page) => {
    await meilisearchClient.index("pages").deleteDocument(page.id);
    if (page.files) {
      page.files.forEach(async ({ id, extension }) => {
        const filePath = path.join(
          (process.cwd(), "uploads", userId, `${id}.${extension}`),
        );
        await fs.rm(filePath);
      });
    }
  });

  return deletedPage;
};
