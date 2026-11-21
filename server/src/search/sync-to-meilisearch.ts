import { db } from "#/db/db.js";
import { pageSelect } from "#/pages/page-queries.js";
import { pageIndex, type MeilisearchPage } from "#/search/init-search.js";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { generateText } from "@tiptap/core";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import type { Doc } from "yjs";

const denormalizePages = async (
  pageIds: string[],
): Promise<Omit<MeilisearchPage, "content">[]> => {
  const pages = await db
    .selectFrom("page")
    .where("page.id", "=", pageIds)
    .select(({ selectFrom }) => [
      ...pageSelect,
      jsonArrayFrom(
        selectFrom("pageTag")
          .innerJoin("tag", "tag.id", "pageTag.tagId")
          .select(["tag.id", "tag.name"])
          .whereRef("pageTag.pageId", "=", "page.id"),
      ).as("tags"),

      jsonArrayFrom(
        selectFrom("member")
          .select(["member.userId"])
          .whereRef("member.organizationId", "=", "page.organizationId"),
      ).as("allowedUsers"),
    ])
    .execute();

  return pages.map((page) => {
    return {
      id: page.id,
      name: page.name,
      authorId: page.authorId,
      isPinned: page.isPinned,
      organizationId: page.organizationId,
      allowedUserIds: page.allowedUsers.map((user) => user.userId),
      tagIds: page.tags.map((tag) => tag.id),
      tagNames: page.tags.map((tag) => tag.name),
      createdAt: page.createdAt.getTime(),
      updatedAt: page.updatedAt.getTime(),
    };
  });
};

const syncPageMetadata = async (
  pageIds: string[],
  action: "upsert" | "delete",
) => {
  if (pageIds.length <= 0) return;

  if (action === "delete") {
    await pageIndex.deleteDocuments(pageIds);
  } else {
    const pages = await denormalizePages(pageIds);
    await pageIndex.updateDocuments(pages);
  }
};

const syncPageContent = async (pageId: string, ydoc: Doc) => {
  const json = TiptapTransformer.fromYdoc(ydoc, "default");

  const plainTextContent = generateText(
    json,
    TiptapTransformer.defaultExtensions,
  );

  await pageIndex.updateDocuments([{ id: pageId, content: plainTextContent }]);
};

export { syncPageContent, syncPageMetadata };
