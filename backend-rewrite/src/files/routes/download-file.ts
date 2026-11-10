import { spaceFileIdSchema } from "#/files/files.schema.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import fs from "node:fs";
import path from "node:path";

export const downloadFileRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/spaces/:spaceId/files/:fileId",
    {
      schema: {
        params: spaceFileIdSchema,
      },
      preHandler: fastify.authGuard.requireContentPermission("read"),
    },
    async (req, res) => {
      const { db } = fastify;
      const { spaceId, fileId } = req.params;

      const dbFile = await db.transaction().execute(async (trx) => {
        return trx
          .selectFrom("file")
          .selectAll()
          .where("organizationId", "=", spaceId)
          .where("id", "=", fileId)
          .executeTakeFirst();
      });

      if (!dbFile) return res.code(400).send();

      const filePath = path.resolve(
        "uploads",
        spaceId.slice(-2),
        spaceId,
        dbFile.id.slice(-2),
        `${dbFile.id}${dbFile.extension}`,
      );

      const stream = fs.createReadStream(filePath);

      return res
        .header(
          "content-disposition",
          `attachment; filename="${dbFile.filename}${dbFile.extension}"`,
        )
        .send(stream);
    },
  );
};
