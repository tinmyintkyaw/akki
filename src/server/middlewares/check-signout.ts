import { auth } from "@/configs/lucia-config";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const checkIfSignedOut: RequestHandler = async (req, res, next) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (!session) return next();

  return res.status(302).setHeader("Location", "/").end();
};

export default asyncHandler(checkIfSignedOut);
