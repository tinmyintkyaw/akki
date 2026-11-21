import { meilisearch } from "./meilisearch.js";

export type MeilisearchPage = {
  id: string;
  name: string;
  content: string;
  authorId: string;
  organizationId: string;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
  tagIds: string[];
  tagNames: string[];
  allowedUserIds: string[];
};

export type MeilisearchPageAttributes = keyof MeilisearchPage;

export const pageIndex = meilisearch.index<MeilisearchPage>("pages");

export const initSearch = async () => {
  try {
    console.log("Looking for existing search index");

    await meilisearch.getIndex("pages");
  } catch (error) {
    console.log("Search index not found, creating");

    const createIdxTask = await meilisearch
      .createIndex("pages", { primaryKey: "id" })
      .waitTask();

    if (createIdxTask.status !== "succeeded") {
      console.error("Failed to create search index");
      process.exit(1);
    }
  }

  const setSearchAttrTask = await pageIndex
    .updateSearchableAttributes([
      "name",
      "content",
      "tagNames",
    ] satisfies MeilisearchPageAttributes[])
    .waitTask();

  const setFilterAttrTask = await pageIndex
    .updateFilterableAttributes([
      "allowedUserIds",
      "organizationId",
      "authorId",
      "tagIds",
      "isPinned",
    ] satisfies MeilisearchPageAttributes[])
    .waitTask();

  console.log("Completed search index setup");

  if (
    setSearchAttrTask.status !== "succeeded" ||
    setFilterAttrTask.status !== "succeeded"
  ) {
    console.error("Failed to setup search index");
    process.exit(1);
  }
};
