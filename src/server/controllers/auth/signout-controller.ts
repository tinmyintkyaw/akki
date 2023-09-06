import { RequestHandler } from "express";
import { auth } from "@/lucia.js";

const signOutController: RequestHandler = async (req, res) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (!session) return res.sendStatus(401);

  await auth.invalidateSession(session.sessionId);
  return res.sendStatus(302);
};

export default signOutController;
