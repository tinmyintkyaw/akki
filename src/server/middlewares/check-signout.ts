import { auth } from "@/configs/lucia-config";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const checkIfSignedOut: RequestHandler = async (req, res, next) => {
  const authRequest = auth.handleRequest(req, res);
  authRequest
    .validate()
    .then(() => res.status(302).setHeader("Location", "/").end())
    .catch(() => next());

  // try {
  //   const authRequest = auth.handleRequest(req, res);
  //   await authRequest.validate();
  //   return res.status(302).setHeader("Location", "/").end();
  // } catch (error) {
  //   next();
  // }
};

export default asyncHandler(checkIfSignedOut);
