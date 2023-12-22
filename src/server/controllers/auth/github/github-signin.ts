import envVars from "@/configs/env-config";
import { githubAuth } from "@/configs/lucia-config";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const githubSignInController: RequestHandler = async (_req, res) => {
  const [url, state] = await githubAuth.getAuthorizationUrl();
  res.cookie("github_oauth_state", state, {
    httpOnly: true,
    secure: envVars.NODE_ENV === "production" ? true : false,
    path: "/",
    maxAge: 60 * 1000,
  });

  return res.status(302).setHeader("Location", url.toString()).end();
};

export default asyncHandler(githubSignInController);
