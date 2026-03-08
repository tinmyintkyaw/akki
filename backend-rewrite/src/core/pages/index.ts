import { createPageRoute } from "@/core/pages/routes/create-page";
import { deletePageRoute } from "@/core/pages/routes/delete-page";
import { getPageByIdRoute } from "@/core/pages/routes/get-page-by-id";
import { getPagesRoute } from "@/core/pages/routes/get-pages";
import { getUntaggedPagesRoute } from "@/core/pages/routes/get-untagged-pages";
import { pinPageRoute } from "@/core/pages/routes/pin-page";
import { tagPageRoute } from "@/core/pages/routes/tag-page";
import { unpinPageRoute } from "@/core/pages/routes/unpin-page";
import { untagPageRoute } from "@/core/pages/routes/untag-page";
import { updatePageRoute } from "@/core/pages/routes/update-page";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const pages: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(getPagesRoute);

  fastify.register(getPageByIdRoute);

  fastify.register(createPageRoute);

  fastify.register(updatePageRoute);

  fastify.register(deletePageRoute);

  fastify.register(pinPageRoute);

  fastify.register(unpinPageRoute);

  fastify.register(getUntaggedPagesRoute);

  fastify.register(tagPageRoute);

  fastify.register(untagPageRoute);
};

export default pages;
