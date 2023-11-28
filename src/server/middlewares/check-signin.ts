import { auth } from "@/configs/lucia-config";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const checkIfSignedIn: RequestHandler = async (req, res, next) => {
  try {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();

    res.locals.session = session;
    next();
  } catch (error) {
    return res.status(401).setHeader("Location", "/signin").end();
  }
};

export default asyncHandler(checkIfSignedIn);
