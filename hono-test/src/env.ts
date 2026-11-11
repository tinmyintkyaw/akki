import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),

  PORT: z.coerce.number().default(3000),
  BASE_URL: z.string(),

  UPLOAD_SIZE_LIMIT: z
    .number()
    .min(1000)
    .default(5 * 1024 * 1024) // 5MB
    .optional(),

  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_HOST: z.string().default("localhost"),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_DB: z.string().min(1),

  MEILISEARCH_HOST: z.string().default("localhost"),
  MEILISEARCH_PORT: z.coerce.number().default(7700),
  MEILISEARCH_KEY: z.string().min(16),

  ENABLE_EMAIL_SIGNIN: z.boolean().default(true),
  DISABLE_SIGNUPS: z.boolean().default(false),
});

export type EnvConfig = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables");
  console.log(parsed.error);
  process.exit();
}

export const env = parsed.data;
