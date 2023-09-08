import { RequestHandler } from "express";
import { auth } from "@/lucia.js";

const checkIfSignedOut: RequestHandler = async (req, res, next) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (session) return res.status(302).setHeader("Location", "/").end();

  next();
};

export default checkIfSignedOut;
