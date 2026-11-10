import auth from "#/auth/index.js";
import config from "#/config/index.js";
import { core } from "#/core/index.js";
import db from "#/db/index.js";
import sensible from "@fastify/sensible";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

const app = Fastify({
  logger: { enabled: true, transport: { target: "pino-pretty" } },
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(sensible);
await app.register(config);

app.log.level = app.config.NODE_ENV !== "production" ? "debug" : "info";

await app.register(db);
await app.register(auth);

// app.register(fastifyWebsocket); // needs to be registered before other routes

await app.register(core, { prefix: "/api" });

app.listen({ port: app.config.PORT });
