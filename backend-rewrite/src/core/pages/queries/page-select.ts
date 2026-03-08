import { Database } from "@/db/database";
import { SelectExpression } from "kysely";

export const pageSelect = [
  "page.id",
  "page.name",
  "page.createdAt",
  "page.createdBy",
  "page.updatedAt",
  "page.spaceId",
] as const satisfies ReadonlyArray<SelectExpression<Database, "page">>;
