import envValidationSchema from "@/validations/env-validation-schema";

interface ProcessEnv {
  NODE_ENV: "production" | "development" | "test";
  PORT: number;
  DATABASE_URL: string;

  GOOGLE_OAUTH_ENABLED: boolean;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;

  GITHUB_OAUTH_ENABLED: boolean;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;

  MEILI_HOST: string;
  MEILI_PORT: number;
  MEILI_MASTER_KEY: string;

  REDIS_PASSWORD: string;

  DEMO_MODE: boolean;
}

const { value: envVars } = envValidationSchema.validate(process.env);

export default envVars as ProcessEnv;
