import auth from "@/plugins/auth";
import config from "@/plugins/config";
import db from "@/plugins/db";
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
await app.register(db);
await app.register(auth);

app.addHook("onRegister", async () => {
  app.log.level = app.config.NODE_ENV !== "production" ? "debug" : "info";
});

app.listen({ port: app.config.PORT });
