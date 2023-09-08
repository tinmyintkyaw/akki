import { RequestHandler } from "express";
import { auth } from "@/lucia.js";
import { typesenseClient } from "@/index.js";

const signOutController: RequestHandler = async (req, res) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (!session) return res.sendStatus(401);

  await typesenseClient.keys(Number(session.typesenseKeyId)).delete();

  await auth.invalidateSession(session.sessionId);
  return res.sendStatus(302);
};

export default signOutController;
