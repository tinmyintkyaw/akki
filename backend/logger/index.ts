import { parsedProcessEnv } from "@/env-vars/env-variables.js";
import winston from "winston";

const logger = winston.createLogger({
  level: parsedProcessEnv.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

export { logger };
