import { parsedProcessEnv } from "@/configs/env-variables.js";
import { googleAuth } from "@/configs/lucia.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const requestHandler: RequestHandler = async (_req, res, next) => {
  try {
    const [url, state] = await googleAuth.getAuthorizationUrl();

    res.cookie("google_oauth_state", state, {
      httpOnly: true,
      secure: parsedProcessEnv.NODE_ENV === "production" ? true : false,
      path: "/",
      maxAge: 60 * 1000,
    });

    return res.status(302).setHeader("Location", url.toString()).end();
  } catch (error) {
    next(error);
  }
};

export const googleSignInController = asyncHandler(requestHandler);
