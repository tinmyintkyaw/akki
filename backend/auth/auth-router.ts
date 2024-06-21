import { checkIfSignedIn } from "@/auth/check-signed-in.js";
import { checkIfSignedOut } from "@/auth/check-signed-out.js";
import { editorTokenController } from "@/collaboration/editor-token.js";
import { githubOAuthCallbackController } from "@/controllers/auth/github-oauth-callback.js";
import { githubSigninController } from "@/controllers/auth/github-signin.js";
import { googleOauthCallbackController } from "@/controllers/auth/google-oauth-callback.js";
import { googleSignInController } from "@/controllers/auth/google-signin.js";
import { signOutController } from "@/controllers/auth/signout.js";
import { searchTokenController } from "@/search/search-token.js";
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

authRouter.get("/auth/editor/token", checkIfSignedIn, editorTokenController);
authRouter.get("/auth/search/token", checkIfSignedIn, searchTokenController);

export { authRouter };
