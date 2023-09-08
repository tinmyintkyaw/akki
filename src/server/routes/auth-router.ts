import signInController from "@/controllers/auth/signin-controller.js";
import signOutController from "@/controllers/auth/signout-controller.js";
import signupController from "@/controllers/auth/signup-controller.js";
import checkIfSignedIn from "@/middlewares/check-signin.js";
import checkIfSignedOut from "@/middlewares/check-signout.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/signup", checkIfSignedOut, signupController);

authRouter.post("/signin", checkIfSignedOut, signInController);

authRouter.post("/signout", checkIfSignedIn, signOutController);

export default authRouter;
