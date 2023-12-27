import { auth } from "@/configs/lucia-config";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { LuciaError } from "lucia";

const checkIfSignedIn: RequestHandler = async (req, res, next) => {
  try {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();

    if (!session) return res.status(401).setHeader("Location", "/signin").end();

    res.locals.session = session;

    next();
  } catch (error) {
    if (error instanceof LuciaError) {
      return res.status(401).setHeader("Location", "/signin").end();
    } else {
      next(error);
    }
  }
};

export default asyncHandler(checkIfSignedIn);
