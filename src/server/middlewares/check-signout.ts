import { auth } from "@/lucia.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const checkIfSignedOut: RequestHandler = async (req, res, next) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (session) return res.status(302).setHeader("Location", "/").end();

  next();
};

export default asyncHandler(checkIfSignedOut);
