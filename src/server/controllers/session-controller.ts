import { auth } from "@/configs/lucia-config";
import SessionResponse from "@/shared/types/session-response";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const sessionController: RequestHandler = async (req, res) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (!session) return res.sendStatus(401);

  res.setHeader("Cache-Control", "no-cache");

  const sessionResponse: SessionResponse = {
    user: { ...session.user },
  };
  return res.status(200).json(sessionResponse);
};

export default asyncHandler(sessionController);
