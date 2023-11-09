import prisma from "@/db/prisma-client";
import { RequestHandler } from "express";
import requestIp from "request-ip";

const editorKeyController: RequestHandler = async (req, res) => {
  const clientIp = requestIp.getClientIp(req);

  const updatedSession = await prisma.session.update({
    where: {
      id: res.locals.session.sessionId,
    },
    data: {
      editorKey: crypto.randomUUID(),
      editorKeyExpires: new Date(Date.now() + 1 * 60 * 1000),
      editorKeyReqIp: clientIp,
    },
  });

  return res.status(200).json({ editorKey: updatedSession.editorKey });
};

export default editorKeyController;
