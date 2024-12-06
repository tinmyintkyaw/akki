import { envVarsSchema } from "@/validation/schemas/env-vars-schema.js";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development" });
}

const parseResult = envVarsSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error("Invalid environment variables, exiting...");
  process.exit(1);
}

const parsedProcessEnv = parseResult.data;

export { parsedProcessEnv };
