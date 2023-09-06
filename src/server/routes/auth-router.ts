import express from "express";
import signInController from "@/controllers/auth/signin-controller.js";
import signupController from "@/controllers/auth/signup-controller.js";
import signOutController from "@/controllers/auth/signout-controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signupController);

authRouter.post("/signin", signInController);

authRouter.post("/signout", signOutController);

export default authRouter;
