import { db } from "@/configs/kysely.js";
import { meilisearchClient } from "@/configs/meilisearch.js";
import { ydocToTextContent } from "@/services/ws/ydoc-to-text-content.js";
import { storePayload } from "@hocuspocus/server";
import { MeilisearchPage } from "@project/shared-types";

export const storePageHandler = async (data: storePayload) => {
  try {
    const textContentArray = await ydocToTextContent(data.document);

    const dbPage = await db
      .updateTable("page")
      .where("user_id", "=", data.context.userId)
      .where("id", "=", data.documentName)
      .set({ ydoc: data.state })
      .returning(["id", "user_id", "modified_at"])
      .executeTakeFirstOrThrow();

    // Update Meilisearch index
    const meilisearchPage: MeilisearchPage = {
      id: dbPage.id,
      textContent: textContentArray,
      modifiedAt: dbPage.modified_at.getTime(),
      userId: dbPage.user_id,
    };

    await meilisearchClient.index("pages").updateDocuments([meilisearchPage]);
  } catch (error) {
    throw new Error("Failed to store page");
  }
};
