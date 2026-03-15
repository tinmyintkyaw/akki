import { Database } from "@/db/database";
import { SelectExpression } from "kysely";

export const pageSelect = [
  "page.id",
  "page.name",
  "page.createdBy",
  "page.createdAt",
  "page.updatedAt",
  "page.deletedAt",
  "page.spaceId",
] as const satisfies ReadonlyArray<SelectExpression<Database, "page">>;
