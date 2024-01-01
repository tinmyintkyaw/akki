import { logger } from "@/configs/logger.js";
import { ErrorRequestHandler } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof Error) logger.error(error.message);

  // if (
  //   error instanceof LuciaError &&
  //   (error.message === "AUTH_INVALID_KEY_ID" ||
  //     error.message === "AUTH_INVALID_PASSWORD")
  // ) {
  //   return res.sendStatus(401);
  // }

  return res.sendStatus(500);
};

export { errorHandler };
