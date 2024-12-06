import { Page } from "@/types/database.js";

type PageSelect = Array<keyof Omit<Page, "ydoc">>;

export const selectArray: PageSelect = [
  "id",
  "pageName",
  "isStarred",
  "path",
  "accessedAt",
  "createdAt",
  "deletedAt",
  "modifiedAt",
];
