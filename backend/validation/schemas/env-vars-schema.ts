import validatorjs from "validator";
import z from "zod";
const { default: validator } = validatorjs;

const googleOAuthEnvVarsSchema = z.discriminatedUnion("GOOGLE_OAUTH_ENABLED", [
  z.object({
    GOOGLE_OAUTH_ENABLED: z.enum(["true"]),
    GOOGLE_CLIENT_ID: z.string().trim(),
    GOOGLE_CLIENT_SECRET: z.string().trim(),
  }),
  z.object({
    GOOGLE_OAUTH_ENABLED: z.enum(["false"]),
    GOOGLE_CLIENT_ID: z.string().default(""),
    GOOGLE_CLIENT_SECRET: z.string().default(""),
  }),
]);

const githubOAuthEnvVarsSchema = z.discriminatedUnion("GITHUB_OAUTH_ENABLED", [
  z.object({
    GITHUB_OAUTH_ENABLED: z.enum(["true"]),
    GITHUB_CLIENT_ID: z.string().trim(),
    GITHUB_CLIENT_SECRET: z.string().trim(),
  }),
  z.object({
    GITHUB_OAUTH_ENABLED: z.enum(["false"]),
    GITHUB_CLIENT_ID: z.string().default(""),
    GITHUB_CLIENT_SECRET: z.string().default(""),
  }),
]);

const envVarsSchema = z
  .object({
    NODE_ENV: z.enum(["production", "development", "test"]),
    PORT: z
      .string()
      .refine((val) => validator.isPort(val))
      .transform((val) => parseInt(val)),

    POSTGRES_HOST: z.string().trim(),
    POSTGRES_PORT: z
      .string()
      .refine((val) => validator.isPort(val))
      .transform((val) => parseInt(val)),
    POSTGRES_DB: z.string().trim(),
    POSTGRES_USER: z.string().trim(),
    POSTGRES_PASSWORD: z.string().trim(),

    MEILI_HOST: z.string().trim().optional(),
    MEILI_PORT: z
      .string()
      .refine((val) => validator.isPort(val))
      .transform((val) => parseInt(val)),
    MEILI_MASTER_KEY: z.string().trim(),

    DEMO_MODE: z.enum(["true", "false"]).optional().default("false"),
  })
  .and(githubOAuthEnvVarsSchema)
  .and(googleOAuthEnvVarsSchema);

export { envVarsSchema };
