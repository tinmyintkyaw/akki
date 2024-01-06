import { logger } from "@/configs/logger.js";
import { ErrorRequestHandler } from "express";
import { LuciaError } from "lucia";
import { ZodError } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof Error) {
    logger.error(error.message);
    console.error(error);
  }

  if (
    error instanceof LuciaError &&
    (error.message === "AUTH_INVALID_KEY_ID" ||
      error.message === "AUTH_INVALID_PASSWORD")
  ) {
    return res.sendStatus(401);
  }

  if (error instanceof ZodError) {
    logger.debug("Validation Error");
    return res.status(400).json({ error });
  }

  return res.sendStatus(500);
};

export { errorHandler };
