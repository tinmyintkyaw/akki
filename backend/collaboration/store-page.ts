import { ydocToTextContent } from "@/collaboration/ydoc-to-text-content.js";
import { db } from "@/db/kysely.js";
import { meilisearchClient } from "@/search/meilisearch.js";
import { storePayload } from "@hocuspocus/server";
import { MeilisearchPage } from "@project/shared-types";

export const storePageHandler = async (data: storePayload) => {
  try {
    const textContentArray = await ydocToTextContent(data.document);

    const dbPage = await db
      .updateTable("Page")
      .where("userId", "=", data.context.userId)
      .where("id", "=", data.documentName)
      .set({ ydoc: data.state })
      .returning(["id", "userId", "modifiedAt"])
      .executeTakeFirstOrThrow();

    // Update Meilisearch index
    const meilisearchPage: MeilisearchPage = {
      id: dbPage.id,
      textContent: textContentArray,
      modifiedAt: dbPage.modifiedAt.getTime(),
      userId: dbPage.userId,
    };

    await meilisearchClient.index("pages").updateDocuments([meilisearchPage]);
  } catch (error) {
    throw new Error("Failed to store page");
  }
};
