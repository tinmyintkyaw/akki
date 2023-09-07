import { RequestHandler } from "express";
import { auth } from "@/lucia.js";

const validateSession: RequestHandler = async (req, res, next) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (!session) return res.status(401).setHeader("Location", "/signin").end();

  res.locals.session = session;
  next();
};

export default validateSession;
