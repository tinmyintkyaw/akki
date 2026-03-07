import { createTagRoute } from "@/core/tags/routes/create-tag";
import { deleteTagRoute } from "@/core/tags/routes/delete-tag";
import { getTagsRoute } from "@/core/tags/routes/get-tags";
import { pinTagRoute } from "@/core/tags/routes/pin-tag";
import { unpinTagRoute } from "@/core/tags/routes/unpin-tag";
import { updateTagRoute } from "@/core/tags/routes/update-tag";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const tags: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(getTagsRoute);

  fastify.register(createTagRoute);

  fastify.register(updateTagRoute);

  fastify.register(deleteTagRoute);

  fastify.register(pinTagRoute);

  fastify.register(unpinTagRoute);
};

export default tags;
