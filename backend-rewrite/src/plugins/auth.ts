import { betterAuth } from "better-auth";
import { fromNodeHeaders } from "better-auth/node";
import { anonymous } from "better-auth/plugins";
import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    auth: AuthInstance;
  }
}

const createAuthInstance = (fastify: FastifyInstance) =>
  betterAuth({
    database: { db: fastify.db },
    advanced: { database: { generateId: false } },
    plugins: fastify.config.NODE_ENV === "development" ? [anonymous()] : [],
    baseURL: fastify.config.BASE_URL,
  });

export type AuthInstance = ReturnType<typeof createAuthInstance>;

export default fastifyPlugin((fastify) => {
  const auth = createAuthInstance(fastify);

  fastify.decorate("auth", auth);

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
});
