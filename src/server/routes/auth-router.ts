import githubSignInController from "@/controllers/auth/github/github-signin";
import githubSignInCallbackController from "@/controllers/auth/github/github-signin-callback";
import googleSignInController from "@/controllers/auth/google/google-signin";
import googleSignInCallbackController from "@/controllers/auth/google/google-signin-callback";
import signInController from "@/controllers/auth/username/signin-controller.js";
import signOutController from "@/controllers/auth/username/signout-controller";
// import signupController from "@/controllers/auth/username/signup-controller";
import checkIfSignedIn from "@/middlewares/check-signin";
import checkIfSignedOut from "@/middlewares/check-signout";
import { usernameSigninPayloadSchema } from "@/validations/auth-validation-schemas";
import express from "express";
import { createValidator } from "express-joi-validation";

const authRouter = express.Router();
const validator = createValidator();

// Username signups are disabled for now
// authRouter.post(
//   "/signup/username",
//   checkIfSignedOut,
//   validator.body(usernameSignupPayloadSchema),
//   signupController,
// );

parseInt(process.env.DEMO_MODE) === 1 &&
  authRouter.post(
    "/signin/username",
    checkIfSignedOut,
    validator.body(usernameSigninPayloadSchema),
    signInController,
  );

authRouter.get("/signin/github", checkIfSignedOut, githubSignInController);

authRouter.get(
  "/signin/github/callback",
  checkIfSignedOut,
  githubSignInCallbackController,
);

authRouter.get("/signin/google", checkIfSignedOut, googleSignInController);

authRouter.get(
  "/signin/google/callback",
  checkIfSignedOut,
  googleSignInCallbackController,
);

authRouter.post("/signout", checkIfSignedIn, signOutController);

export default authRouter;
