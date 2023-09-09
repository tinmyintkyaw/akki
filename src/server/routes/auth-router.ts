import githubSignInCallbackController from "@/controllers/auth/github/github-signin-callback.js";
import githubSignInController from "@/controllers/auth/github/github-signin.js";
import googleSignInCallbackController from "@/controllers/auth/google/google-signin-callback.js";
import googleSignInController from "@/controllers/auth/google/google-signin.js";
import signInController from "@/controllers/auth/signin-controller.js";
import signOutController from "@/controllers/auth/signout-controller.js";
import signupController from "@/controllers/auth/signup-controller.js";
import checkIfSignedIn from "@/middlewares/check-signin.js";
import checkIfSignedOut from "@/middlewares/check-signout.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/signup/username", checkIfSignedOut, signupController);

authRouter.post("/signin/username", checkIfSignedOut, signInController);

authRouter.get("/signin/github", checkIfSignedOut, githubSignInController);

authRouter.get(
  "/signin/github/callback",
  checkIfSignedOut,
  githubSignInCallbackController
);

authRouter.get("/signin/google", checkIfSignedOut, googleSignInController);

authRouter.get(
  "/signin/google/callback",
  checkIfSignedOut,
  googleSignInCallbackController
);

authRouter.post("/signout", checkIfSignedIn, signOutController);

export default authRouter;
