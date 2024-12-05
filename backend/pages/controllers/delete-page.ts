import { db } from "@/db/kysely.js";
import { meilisearchClient } from "@/search/meilisearch.js";
import { File } from "@/types/database.js";
import { TypedRequestHandler } from "@/validation/request-validator.js";
import { PageIdAsParamsSchema } from "@/validation/schemas/page-schema.js";
import asyncHandler from "express-async-handler";
import fs from "fs/promises";
import { sql } from "kysely";
import path from "path";

type DeletePageControllerType = TypedRequestHandler<
  PageIdAsParamsSchema,
  never
>;

const requestHandler: DeletePageControllerType = async (req, res) => {
  const { user } = res.locals.session;

  const deletedPage = await db
    .with("pages_to_delete", (db) =>
      db
        .selectFrom("Page")
        .leftJoin("File", "File.pageId", "Page.id")
        .select((eb) => [
          "Page.id",
          eb
            .case()
            .when(eb.fn.count("File.id"), ">", 0)
            .then(
              sql<
                Pick<File, "id" | "extension">[]
              >`array_agg(json_build_object('id', file.id, 'extension', file.extension))`,
            )
            .else(null)
            .end()
            .as("files"),
        ])
        .where(sql`page.path ~ ('*.' || ${req.params.pageId} || '.*')::lquery`)
        .where("Page.userId", "=", user.id)
        .groupBy(["Page.id"]),
    )
    .deleteFrom("Page")
    .using("pages_to_delete")
    .where("Page.id", "=", (eb) => eb.ref("pages_to_delete.id"))
    .returningAll()
    .execute();

  // Delete all the files related to the page
  deletedPage.forEach(async (page) => {
    await meilisearchClient.index("pages").deleteDocument(page.id);
    if (page.files) {
      page.files.forEach(async ({ id, extension }) => {
        const filePath = path.join(
          (process.cwd(), "uploads", user.id, `${id}.${extension}`),
        );
        await fs.rm(filePath);
      });
    }
  });

  return res.sendStatus(204);
};

export const deletePageController = asyncHandler(requestHandler);
