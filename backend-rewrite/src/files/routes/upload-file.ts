import { getAccessibleSpaces } from "@/core/spaces/spaces.queries";
import { spacesReqParams } from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { v7 as uuidv7 } from "uuid";

export const uploadFileRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/",
    {
      schema: {
        params: spacesReqParams,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;

      const data = await req.file();

      if (!data) return res.code(400).send();

      const extension = path.extname(data.filename);

      const newFile = await db.transaction().execute(async (trx) => {
        await getAccessibleSpaces(trx, {
          userId,
          spaceId,
        }).executeTakeFirstOrThrow();

        const fileId = uuidv7();

        const savePath = path.resolve(
          "uploads",
          spaceId.slice(-2),
          spaceId,
          fileId.slice(-2), // use last two characters for directory sharding
          `${fileId}${extension}`,
        );

        await fs.promises.mkdir(path.dirname(savePath), { recursive: true });

        await pipeline(data.file, fs.createWriteStream(savePath));

        if (data.file.truncated) {
          await fs.promises.unlink(savePath);
          throw new fastify.multipartErrors.FilesLimitError();
        }

        const dbFile = await trx
          .insertInto("file")
          .values({
            id: fileId,
            extension,
            spaceId,
            createdBy: userId,
            filename: path.basename(data.filename, path.extname(data.filename)), // second argument required to extract filename without extension
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        return dbFile;
      });

      if (!newFile) return res.code(400).send();

      return res.code(201).send(newFile);
    },
  );
};
