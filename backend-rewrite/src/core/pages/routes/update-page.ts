import {
  pageUpdatePayload,
  spacePageIdSchema,
} from "#/core/pages/pages.schema.js";
import { pageSelect } from "#/core/pages/queries/page-select.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const updatePageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.put(
    "/spaces/:spaceId/pages/:pageId",
    {
      schema: {
        params: spacePageIdSchema,
        body: pageUpdatePayload,
      },
      preHandler: fastify.authGuard.requireContentPermission("write"),
    },
    async (req, res) => {
      const { db } = fastify;
      const { spaceId, pageId } = req.params;
      const { name, isPinned, isDeleted } = req.body;

      const newPage = await db
        .updateTable("page")
        .where("id", "=", pageId)
        .where("organizationId", "=", spaceId)
        .set({
          name,
          deletedAt: isDeleted ? new Date() : null,
          isPinned,
        })
        .returning(pageSelect)
        .executeTakeFirst();

      if (!newPage) throw fastify.httpErrors.notFound();
      return res.code(201).send(newPage);
    },
  );
};
