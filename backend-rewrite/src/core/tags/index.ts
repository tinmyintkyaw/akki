import { createTagRoute } from "@/core/tags/routes/create-tag";
import { deleteTagRoute } from "@/core/tags/routes/delete-tag";
import { getTagsRoute } from "@/core/tags/routes/get-tags";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const tags: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(getTagsRoute);

  fastify.register(createTagRoute);

  fastify.register(deleteTagRoute);
};

export default tags;
