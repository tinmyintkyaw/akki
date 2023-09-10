import { githubAuth } from "@/lucia.js";
import { RequestHandler } from "express";

const githubSignInController: RequestHandler = async (_req, res) => {
  const [url, state] = await githubAuth.getAuthorizationUrl();
  res.cookie("github_oauth_state", state, {
    httpOnly: true,
    secure: false, // TODO: should be true in PROD
    path: "/",
    maxAge: 60 * 1000,
  });

  return res.status(302).setHeader("Location", url.toString()).end();
};

export default githubSignInController;
