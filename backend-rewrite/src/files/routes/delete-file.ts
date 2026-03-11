import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { fileReqParams } from "@/files/files.schema";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import fs from "node:fs";
import path from "node:path";

export const deleteFileRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    "/:fileId",
    {
      schema: {
        params: fileReqParams,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId, fileId } = req.params;

      await db.transaction().execute(async (trx) => {
        await getAccessibleSpaces(trx, {
          userId,
          spaceId,
        }).executeTakeFirst();

        const fileToDel = await trx
          .selectFrom("file")
          .selectAll()
          .where("spaceId", "=", spaceId)
          .where("id", "=", fileId)
          .executeTakeFirstOrThrow();

        const filePath = path.resolve(
          "uploads",
          spaceId.slice(-2),
          spaceId,
          fileToDel.id.slice(-2),
          `${fileToDel.id}${fileToDel.extension}`,
        );

        await fs.promises.rm(filePath);

        await trx
          .deleteFrom("file")
          .where("spaceId", "=", spaceId)
          .where("id", "=", fileId)
          .returningAll()
          .executeTakeFirstOrThrow();
      });

      return res.code(204).send();
    },
  );
};
