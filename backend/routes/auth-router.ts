import { githubOAuthCallbackController } from "@/controllers/auth/github-oauth-callback.js";
import { githubSigninController } from "@/controllers/auth/github-signin.js";
import { googleOauthCallbackController } from "@/controllers/auth/google-oauth-callback.js";
import { googleSignInController } from "@/controllers/auth/google-signin.js";
import { signOutController } from "@/controllers/auth/signout.js";
import { checkIfSignedIn } from "@/middlewares/check-signed-in.js";
import { checkIfSignedOut } from "@/middlewares/check-signed-out.js";
import express from "express";

const authRouter = express.Router();

authRouter.get("/signin/github", checkIfSignedOut, githubSigninController);

authRouter.get(
  "/signin/github/callback",
  checkIfSignedOut,
  githubOAuthCallbackController,
);

authRouter.get("/signin/google", checkIfSignedOut, googleSignInController);

authRouter.get(
  "/signin/google/callback",
  checkIfSignedOut,
  googleOauthCallbackController,
);

authRouter.post("/signout", checkIfSignedIn, signOutController);

export { authRouter };
