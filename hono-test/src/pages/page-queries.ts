import type { Database } from "#/db/database.js";
import type { SelectExpression } from "kysely";

export const pageSelect = [
  "page.id",
  "page.name",
  "page.authorId",
  "page.createdAt",
  "page.updatedAt",
  "page.deletedAt",
  "page.organizationId",
] as const satisfies ReadonlyArray<SelectExpression<Database, "page">>;
