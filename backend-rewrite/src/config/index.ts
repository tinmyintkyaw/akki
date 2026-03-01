import fastifyEnv from "@fastify/env";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import z from "zod";

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("production"),

    PORT: z.coerce.number().default(3000),
    BASE_URL: z.string(),

    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_HOST: z.string().default("localhost"),
    POSTGRES_PORT: z.number().default(5432),
    POSTGRES_DB: z.string().min(1),

    ENABLE_EMAIL_SIGNIN: z.boolean().default(true),
    DISABLE_SIGNUPS: z.boolean().default(false),

    TYPESENSE_API_HOST: z.string().default("localhost"),
    TYPESENSE_API_PORT: z.number().default(8108),
    TYPESENSE_API_KEY: z.string().min(8),
  })
  .required({ BASE_URL: true });

export type AppConfig = z.infer<typeof envSchema>;

declare module "fastify" {
  interface FastifyInstance {
    config: AppConfig;
  }
}

const config: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyEnv, {
    schema: z.toJSONSchema(envSchema, { target: "draft-07" }), // fastify defaults to draft-07
    dotenv: true,
  });
};

export default fastifyPlugin(config, { name: "config" });
