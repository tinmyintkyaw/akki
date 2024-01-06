import { auth } from "@/configs/lucia.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const requestHandler: RequestHandler = async (req, res) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (!session) return res.sendStatus(401);

  await auth.invalidateSession(session.sessionId);
  return res.sendStatus(302);
};

export const signOutController = asyncHandler(requestHandler);
