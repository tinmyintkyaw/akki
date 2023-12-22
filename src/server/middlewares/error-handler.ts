import logger from "@/configs/logger-config";
import { ErrorRequestHandler } from "express";
import { LuciaError } from "lucia";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof Error) logger.error(error.message);
  if (
    error instanceof LuciaError &&
    (error.message === "AUTH_INVALID_KEY_ID" ||
      error.message === "AUTH_INVALID_PASSWORD")
  ) {
    return res.sendStatus(401);
  }

  logger.error("An error occured");
  return res.sendStatus(500);
};

export default errorHandler;
