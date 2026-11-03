import { pageIdSchema, pageUpdatePayload } from "@/core/pages/pages.schema";
import { pageSelect } from "@/core/pages/queries/page-select";
import { getSpaceRole } from "@/core/spaces/spaces.queries";
import { spaceIdSchema } from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const updatePageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.put(
    "/:pageId",
    {
      schema: {
        params: spaceIdSchema.extend(pageIdSchema.shape),
        body: pageUpdatePayload,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId, pageId } = req.params;
      const { name, isPinned, isDeleted } = req.body;

      const newPage = await db.transaction().execute(async (trx) => {
        const role = await getSpaceRole(trx, spaceId, userId, "member");

        if (!role) throw fastify.httpErrors.forbidden();

        return trx
          .updateTable("page")
          .where("id", "=", pageId)
          .where("spaceId", "=", spaceId)
          .set({
            name,
            deletedAt: isDeleted ? new Date() : null,
            isPinned,
          })
          .returning(pageSelect)
          .executeTakeFirst();
      });

      if (!newPage) throw fastify.httpErrors.notFound();
      return res.code(201).send(newPage);
    },
  );
};
