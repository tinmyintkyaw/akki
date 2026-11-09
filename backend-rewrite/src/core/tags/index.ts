import { createTagRoute } from "#/core/tags/routes/create-tag.js";
import { deleteTagRoute } from "#/core/tags/routes/delete-tag.js";
import { getTagsRoute } from "#/core/tags/routes/get-tags.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const tags: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(getTagsRoute);

  fastify.register(createTagRoute);

  fastify.register(deleteTagRoute);
};

export default tags;
