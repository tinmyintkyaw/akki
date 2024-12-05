import { auth } from "@/auth/better-auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

const requestHandler: RequestHandler = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) return res.redirect("/signin");
    res.locals.session = session;
    next();
  } catch (error) {
    res.sendStatus(500);
  }
};

export const authenticatedUser = asyncHandler(requestHandler);
