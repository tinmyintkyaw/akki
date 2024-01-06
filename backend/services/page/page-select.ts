import { Page } from "@/types/database.js";

type PageSelect = Array<keyof Omit<Page, "ydoc">>;

export const selectArray: PageSelect = [
  "id",
  "page_name",
  "is_starred",
  "path",
  "accessed_at",
  "created_at",
  "deleted_at",
  "modified_at",
];
