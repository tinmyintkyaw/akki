import { pageSelect } from "@/core/pages/queries/page-select";
import { getSpaceRole } from "@/core/spaces/spaces.queries";
import { spaceIdSchema } from "@/core/spaces/spaces.schemas";
import { Session } from "better-auth";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { pageNameSchema } from "../pages.schema";

export const createPageRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/",
    {
      schema: {
        params: spaceIdSchema,
        body: pageNameSchema,
      },
    },
    async (req, res) => {
      const { db } = fastify;
      const { userId } = req.getDecorator<Session>("session");
      const { spaceId } = req.params;
      const { name } = req.body;

      try {
        const newPage = await db.transaction().execute(async (trx) => {
          const role = await getSpaceRole(trx, spaceId, userId);
          if (!role) throw fastify.httpErrors.unauthorized();

          return await trx
            .insertInto("page")
            .values({
              name,
              spaceId,
              createdBy: userId,
              ydoc: Buffer.from(""), // TODO: properly initialize ydoc
            })
            .returning(pageSelect)
            .executeTakeFirstOrThrow();
        });

        return res.code(201).send(newPage);
      } catch (error) {
        throw error;
      }
    },
  );
};
