import { Request } from "express";
import { parseCookie } from "lucia/utils";

export const validateOAuthStateCookie = (req: Request, cookieName: string) => {
  const cookie = req.headers.cookie;
  const { state, code } = req.query;

  if (!cookie) return null;
  if (!state || typeof code !== "string") return null;

  const parsedCookies = parseCookie(cookie);
  const storedState = parsedCookies[cookieName];

  if (!storedState) return null;

  // validate state
  const oauthCode = storedState === state ? code : null;
  return oauthCode;
};
