import { auth } from "@/configs/lucia-config";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const checkIfSignedIn: RequestHandler = async (req, res, next) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (!session) return res.status(401).setHeader("Location", "/signin").end();

  res.locals.session = session;
  next();
};

export default asyncHandler(checkIfSignedIn);
