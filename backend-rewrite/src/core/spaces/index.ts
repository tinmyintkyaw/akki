import { addMembersRoute } from "@/core/spaces/routes/add-members";
import { createSpaceRoute } from "@/core/spaces/routes/create-space";
import { deleteSpaceRoute } from "@/core/spaces/routes/delete-space";
import { getSpacesRoute } from "@/core/spaces/routes/get-spaces";
import { removeMemberRoute } from "@/core/spaces/routes/remove-member";
import { updateSpaceRoute } from "@/core/spaces/routes/update-space";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const spaces: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(getSpacesRoute);

  fastify.register(createSpaceRoute);

  fastify.register(deleteSpaceRoute);

  fastify.register(updateSpaceRoute);

  fastify.register(addMembersRoute);

  fastify.register(removeMemberRoute);
};

export default spaces;
