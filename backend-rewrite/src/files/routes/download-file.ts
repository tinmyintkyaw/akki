import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { fileReqParams } from "@/files/files.schema";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import fs from "node:fs";
import path from "node:path";

export const downloadFileRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
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

      const dbFile = await db.transaction().execute(async (trx) => {
        await getAccessibleSpaces(trx, {
          userId,
          spaceId,
        }).executeTakeFirstOrThrow();

        return trx
          .selectFrom("file")
          .selectAll()
          .where("spaceId", "=", spaceId)
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
