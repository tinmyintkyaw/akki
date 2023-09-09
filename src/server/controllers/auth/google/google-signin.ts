import { googleAuth } from "@/lucia.js";
import { RequestHandler } from "express";

const googleSignInController: RequestHandler = async (_req, res, next) => {
  try {
    const [url, state] = await googleAuth.getAuthorizationUrl();

    res.cookie("google_oauth_state", state, {
      httpOnly: true,
      secure: false, // TODO: should be true in PROD
      path: "/",
      maxAge: 60 * 1000,
    });

    console.log(url.toString());

    return res.status(302).setHeader("Location", url.toString()).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default googleSignInController;
