import db from "@/db";
import auth from "@/plugins/auth";
import config from "@/plugins/config";
import typesense from "@/search/typesense";
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

app.listen({ port: app.config.PORT });
