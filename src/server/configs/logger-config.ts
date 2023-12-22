import envVars from "@/configs/env-config";
import winston from "winston";

const logger = winston.createLogger({
  level: envVars.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

export default logger;
