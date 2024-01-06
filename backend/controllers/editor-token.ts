import { createWSAuthToken } from "@/services/ws/create-auth-token.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import requestIp from "request-ip";

const requestHandler: RequestHandler = async (req, res) => {
  const { session } = res.locals;
  const clientIp = requestIp.getClientIp(req);

  if (!clientIp) return res.sendStatus(400);

  const token = await createWSAuthToken(
    session.user.userId,
    session.sessionId,
    clientIp,
  );

  return res.status(200).json(token);
};

export const editorTokenController = asyncHandler(requestHandler);
