import { ErrorRequestHandler } from "express";
import { LuciaError } from "lucia";

const errorHandler: ErrorRequestHandler = (error, _req, res) => {
  if (
    error instanceof LuciaError &&
    (error.message === "AUTH_INVALID_KEY_ID" ||
      error.message === "AUTH_INVALID_PASSWORD")
  ) {
    return res.sendStatus(401);
  }

  return res.sendStatus(500);
};

export default errorHandler;
