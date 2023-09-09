import { RequestHandler } from "express";
import { auth } from "@/lucia.js";

const sessionController: RequestHandler = async (req, res) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (!session) return res.sendStatus(401);

  return res.status(200).json(session);
};

export default sessionController;
