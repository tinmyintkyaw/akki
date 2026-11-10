import { spaceFileIdSchema } from "#/files/files.schema.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import fs from "node:fs";
import path from "node:path";

export const deleteFileRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.delete(
    "/:fileId",
    {
      schema: {
        params: spaceFileIdSchema,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { spaceId, fileId } = req.params;

      await fastify.auth.api.getActiveMemberRole({
        headers: req.headers,
        query: { organizationId: spaceId },
      });

      await db.transaction().execute(async (trx) => {
        const fileToDel = await trx
          .selectFrom("file")
          .selectAll()
          .where("organizationId", "=", spaceId)
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
          .where("organizationId", "=", spaceId)
          .where("id", "=", fileId)
          .returningAll()
          .executeTakeFirstOrThrow();
      });

      return res.code(204).send();
    },
  );
};
