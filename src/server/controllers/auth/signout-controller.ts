import { RequestHandler } from "express";
import { auth } from "@/lucia.js";
import typesenseClient from "@/db/typesense-client.js";

const signOutController: RequestHandler = async (req, res) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (!session) return res.sendStatus(401);

  await typesenseClient.keys(session.user.searchKeyId).delete();

  await auth.invalidateSession(session.sessionId);
  return res.sendStatus(302);
};

export default signOutController;
