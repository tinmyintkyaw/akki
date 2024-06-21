import { createWSAuthToken } from "@/collaboration/create-auth-token.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import requestIp from "request-ip";

const requestHandler: RequestHandler = async (req, res) => {
  const { session } = res.locals;
  const clientIp = requestIp.getClientIp(req);

  if (!clientIp) return res.sendStatus(400);

  const editorToken = await createWSAuthToken(
    session.userId,
    session.id,
    clientIp,
  );

  return res.status(200).json({ editorToken });
};

export const editorTokenController = asyncHandler(requestHandler);
