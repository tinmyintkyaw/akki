import { Database } from "@/db/database";
import { SelectExpression } from "kysely";

export const tagSelect = [
  "tag.id",
  "tag.name",
  "tag.createdAt",
  "tag.createdBy",
  "tag.updatedAt",
] as const satisfies ReadonlyArray<SelectExpression<Database, "tag">>;
