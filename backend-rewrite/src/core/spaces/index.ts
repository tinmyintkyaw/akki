import { createSpaceRoute } from "#/core/spaces/routes/create-space.js";
import { deleteSpaceRoute } from "#/core/spaces/routes/delete-space.js";
import { getSpacesRoute } from "#/core/spaces/routes/get-spaces.js";
import { addSpaceMemberRoute } from "#/core/spaces/routes/members/add-member.js";
import { getSpaceMembersRoute } from "#/core/spaces/routes/members/get-members.js";
import { removeSpaceMemberRoute } from "#/core/spaces/routes/members/remove-member.js";
import { updateSpaceMemberRoute } from "#/core/spaces/routes/members/update-member.js";
import { updateSpaceRoute } from "#/core/spaces/routes/update-space.js";
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
