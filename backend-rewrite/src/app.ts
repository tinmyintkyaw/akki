import auth from "@/plugins/auth";
import config from "@/plugins/config";
import db from "@/plugins/db";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(config);
await app.register(db);
await app.register(auth);

app.listen({ port: app.config.PORT });
