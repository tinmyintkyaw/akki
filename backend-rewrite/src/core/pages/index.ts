import { createPageRoute } from "#/core/pages/routes/create-page.js";
import { deletePageRoute } from "#/core/pages/routes/delete-page.js";
import { getPageByIdRoute } from "#/core/pages/routes/get-page-by-id.js";
import { getPagesRoute } from "#/core/pages/routes/get-pages.js";
import { updatePageRoute } from "#/core/pages/routes/update-page.js";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const pages: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(getPagesRoute);
  fastify.register(getPageByIdRoute);
  fastify.register(createPageRoute);
  fastify.register(updatePageRoute);
  fastify.register(deletePageRoute);
};

export default pages;
