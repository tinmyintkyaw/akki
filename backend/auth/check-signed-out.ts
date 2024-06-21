import { auth } from "@/configs/lucia.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { LuciaError } from "lucia";

const requestHandler: RequestHandler = async (req, res, next) => {
  const authRequest = auth.handleRequest(req, res);

  // Check and remove the existing invalid sessions
  try {
    const session = await authRequest.validate();
    if (!session) authRequest.setSession(null);
  } catch (error) {
    if (error instanceof LuciaError) authRequest.setSession(null);
  }

  const session = await authRequest.validate();
  if (!session) return next();

  return res.status(302).setHeader("Location", "/").end();
};

export const checkIfSignedOut = asyncHandler(requestHandler);
