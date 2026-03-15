import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { Database } from "@/db/database";
import { Kysely } from "kysely";

export const getPage = async (
  db: Kysely<Database>,
  data: { userId: string; spaceId: string; pageId: string },
) => {
  const { userId, spaceId, pageId } = data;

  const page = await db.transaction().execute(async (trx) => {
    await getAccessibleSpaces(trx, {
      userId,
      spaceId,
    }).executeTakeFirstOrThrow();

    return trx
      .selectFrom("page")
      .where("id", "=", pageId)
      .where("spaceId", "=", spaceId)
      .select(["id", "ydoc"])
      .executeTakeFirstOrThrow();
  });

  return page;
};
