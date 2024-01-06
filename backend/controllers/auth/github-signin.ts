import { parsedProcessEnv } from "@/configs/env-variables.js";
import { githubAuth } from "@/configs/lucia.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const requestHandler: RequestHandler = async (_req, res) => {
  const [url, state] = await githubAuth.getAuthorizationUrl();
  res.cookie("github_oauth_state", state, {
    httpOnly: true,
    secure: parsedProcessEnv.NODE_ENV === "production" ? true : false,
    path: "/",
    maxAge: 60 * 1000,
  });

  return res.status(302).setHeader("Location", url.toString()).end();
};

export const githubSigninController = asyncHandler(requestHandler);
