import { spaceIdSchema } from "#/files/files.schema.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const getFilesRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/spaces/:spaceId/files",
    {
      schema: {
        params: spaceIdSchema,
      },
      preHandler: fastify.authGuard.requireContentPermission("read"),
    },
    async (req, res) => {
      const { db } = fastify;
      const { spaceId } = req.params;

      const files = await db
        .selectFrom("file")
        .selectAll()
        .where("organizationId", "=", spaceId)
        .execute();

      if (!files) throw fastify.httpErrors.notFound();
      return res.send(files);
    },
  );
};
