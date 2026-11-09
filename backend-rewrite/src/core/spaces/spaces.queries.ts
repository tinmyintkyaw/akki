import { Database } from "#/db/database.js";
import { Kysely, SelectExpression, Transaction } from "kysely";

export const spaceSelect = [
  "space.id",
  "space.name",
  "space.createdAt",
  "space.updatedAt",
] as const satisfies ReadonlyArray<SelectExpression<Database, "space">>;

export const getSpaceRole = async (
  db: Kysely<Database> | Transaction<Database>,
  spaceId: string,
  userId: string,
  role?: Database["spaceMembers"]["role"],
) => {
  let query = db
    .selectFrom("spaceMembers")
    .selectAll()
    .where("spaceId", "=", spaceId)
    .where("userId", "=", userId);

  if (role) {
    query = query.where("role", "=", role);
  }

  const member = await query.executeTakeFirst();

  if (!member) return null;
  return member.role;
};
