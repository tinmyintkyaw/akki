import { parsedProcessEnv } from "@/validation/env-vars-validator.js";
import winston from "winston";

const logger = winston.createLogger({
  level: parsedProcessEnv.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

export { logger };
