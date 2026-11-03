import { createSpaceRoute } from "@/core/spaces/routes/create-space";
import { deleteSpaceRoute } from "@/core/spaces/routes/delete-space";
import { getSpacesRoute } from "@/core/spaces/routes/get-spaces";
import { addSpaceMemberRoute } from "@/core/spaces/routes/members/add-member";
import { getSpaceMembersRoute } from "@/core/spaces/routes/members/get-members";
import { removeSpaceMemberRoute } from "@/core/spaces/routes/members/remove-member";
import { updateSpaceMemberRoute } from "@/core/spaces/routes/members/update-member";
import { updateSpaceRoute } from "@/core/spaces/routes/update-space";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const spaces: FastifyPluginAsyncZod = async (fastify) => {
  fastify.register(getSpacesRoute);
  fastify.register(createSpaceRoute);
  fastify.register(deleteSpaceRoute);
  fastify.register(updateSpaceRoute);

  fastify.register(getSpaceMembersRoute);
  fastify.register(addSpaceMemberRoute);
  fastify.register(removeSpaceMemberRoute);
  fastify.register(updateSpaceMemberRoute);
};

export default spaces;
