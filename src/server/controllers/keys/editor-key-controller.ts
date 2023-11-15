import redisClient from "@/configs/ioredis-config";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import requestIp from "request-ip";

const editorKeyController: RequestHandler = async (req, res) => {
  const clientIp = requestIp.getClientIp(req);
  const editorKey = crypto.randomUUID();

  redisClient.set(
    `editor:${editorKey}`,
    JSON.stringify({
      editorKeyExpires: Date.now() + 1 * 60 * 1000,
      editorKeyReqIp: clientIp,
      userId: res.locals.session.user.userId,
      sessionId: res.locals.session.sessionId,
    }),
  );

  return res.status(200).json({ editorKey });
};

export default asyncHandler(editorKeyController);
