import { spaceIdSchema } from "#/files/files.schema.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const getFilesRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get(
    "/",
    {
      schema: {
        params: spaceIdSchema,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { spaceId } = req.params;

      await fastify.auth.api.getActiveMemberRole({
        headers: req.headers,
        query: { organizationId: spaceId },
      });

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
