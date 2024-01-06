import { auth } from "@/configs/lucia.js";
import { createSession } from "@/services/auth/create-session.js";
import { validateGithubOAuthCallback } from "@/services/auth/validate-github-oauth-callback.js";
import { validateOAuthStateCookie } from "@/services/auth/validate-oauth-state-cookie.js";
import { RequestHandler } from "express";
import asyncHanlder from "express-async-handler";

const requestHandler: RequestHandler = async (req, res) => {
  const stateCookieName = "github_oauth_state";
  const code = validateOAuthStateCookie(req, stateCookieName);

  if (!code) return res.sendStatus(400);

  const user = await validateGithubOAuthCallback(code);

  const session = await createSession(user.userId);

  auth.handleRequest(req, res).setSession(session);

  return res.status(302).setHeader("Location", "/").end();
};

export const githubOAuthCallbackController = asyncHanlder(requestHandler);
