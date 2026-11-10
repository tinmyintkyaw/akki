import {
  AuthInstance,
  createAuthInstance,
} from "#/auth/create-auth-instance.js";
import { requireContentPermission } from "#/auth/require-content-permission.js";
import { requireSession } from "#/auth/require-session.js";
import { fromNodeHeaders } from "better-auth/node";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    auth: AuthInstance;
    authGuard: {
      requireSession: typeof requireSession;
      requireContentPermission: typeof requireContentPermission;
    };
  }

  interface FastifyRequest {
    session: ReturnType<typeof createAuthInstance>["$Infer"]["Session"] | null;
  }
}

const auth: FastifyPluginAsync = async (fastify) => {
  const auth = createAuthInstance(fastify);

  fastify.decorate("auth", auth);

  const authGuardDecorator = {
    requireSession,
    requireContentPermission,
  };

  fastify.decorate("authGuard", authGuardDecorator);

  fastify.decorateRequest("session", null);

  fastify.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(request, reply) {
      try {
        // Construct request URL
        const url = new URL(request.url, `http://${request.headers.host}`);

        // Convert Fastify headers to standard Headers object
        const headers = fromNodeHeaders(request.headers);

        // Create Fetch API-compatible request
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          ...(request.body ? { body: JSON.stringify(request.body) } : {}),
        });
        // Process authentication request
        const response = await auth.handler(req);
        // Forward response to client
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        reply.send(response.body ? await response.text() : null);
      } catch (error) {
        fastify.log.error(error, "Authentication Error:");
        reply.status(500).send({
          error: "Internal authentication error",
          code: "AUTH_FAILURE",
        });
      }
    },
  });
};

export default fastifyPlugin(auth, {
  name: "auth",
  dependencies: ["db", "config"],
});
