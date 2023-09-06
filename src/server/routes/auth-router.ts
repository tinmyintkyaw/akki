import express from "express";
import signInController from "../controllers/auth/signin-controller";
import signupController from "../controllers/auth/signup-controller";
import signOutController from "../controllers/auth/signout-controller";

const authRouter = express.Router();

authRouter.post("/signup", signupController);

authRouter.post("/signin", signInController);

authRouter.post("/signout", signOutController);

export default authRouter;
