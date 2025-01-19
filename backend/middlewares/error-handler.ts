import { logger } from "@/logger/index.js";
import { parsedProcessEnv } from "@/validation/env-vars-validator.js";
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof Error) {
    logger.error(error.message);
    console.error(error);
  }

  if (error instanceof ZodError) {
    logger.debug("Validation Error");
    if (parsedProcessEnv.NODE_ENV === "development") {
      return res.status(400).json({ error });
    } else {
      return res.status(400);
    }
  }

  return res.sendStatus(500);
};

export { errorHandler };
