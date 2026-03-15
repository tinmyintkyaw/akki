import auth from "@/auth";
import config from "@/config";
import { core } from "@/core";
import db from "@/db";
import typesense from "@/search/typesense";
import fastifyWebsocket from "@fastify/websocket";
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

await app.register(config);

app.log.level = app.config.NODE_ENV !== "production" ? "debug" : "info";

await app.register(db);
await app.register(typesense);
await app.register(auth);

app.register(fastifyWebsocket); // needs to be registered before other routes

await app.register(core, { prefix: "/api" });

app.listen({ port: app.config.PORT });
