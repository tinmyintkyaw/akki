import { Database } from "@/db/database";
import { Kysely, SelectExpression } from "kysely";

export const spaceSelect = [
  "space.id",
  "space.name",
  "space.createdBy",
  "space.createdAt",
  "space.updatedAt",
] as const satisfies ReadonlyArray<SelectExpression<Database, "space">>;

export const getOwnSpaces = (
  db: Kysely<Database>,
  opts: { userId: string; spaceId?: string },
) => {
  let query = db
    .selectFrom("space")
    .select(spaceSelect)
    .where("createdBy", "=", opts.userId);

  if (opts.spaceId) {
    query = query.where("space.id", "=", opts.spaceId);
  }

  return query;
};

export const getSharedSpaces = (
  db: Kysely<Database>,
  opts: { userId: string; spaceId?: string },
) => {
  let query = db
    .selectFrom("space")
    .innerJoin("spaceMembers", "spaceMembers.spaceId", "space.id")
    .select(spaceSelect)
    .where("spaceMembers.userId", "=", opts.userId);

  if (opts.spaceId) {
    query = query.where("space.id", "=", opts.spaceId);
  }

  return query;
};

export const getAccessibleSpaces = (
  db: Kysely<Database>,
  opts: { userId: string; spaceId?: string },
) => {
  const { userId, spaceId } = opts;

  const query = getOwnSpaces(db, { userId, spaceId }).unionAll(
    getSharedSpaces(db, { userId, spaceId }),
  );

  return query;
};
