import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { Database } from "@/db/database";
import { Kysely } from "kysely";

export const storePage = async (
  db: Kysely<Database>,
  data: { userId: string; spaceId: string; pageId: string; ydoc: Buffer },
) => {
  const { userId, spaceId, pageId, ydoc } = data;

  await db.transaction().execute(async (trx) => {
    await getAccessibleSpaces(trx, {
      userId,
      spaceId,
    }).executeTakeFirstOrThrow();

    return await trx
      .updateTable("page")
      .where("id", "=", pageId)
      .where("spaceId", "=", spaceId)
      .set({ ydoc })
      .executeTakeFirstOrThrow();
  });
};
