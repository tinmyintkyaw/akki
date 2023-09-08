import sessionController from "@/controllers/session-controller.js";
import checkIfSignedIn from "@/middlewares/check-signin.js";
import authRouter from "@/routes/auth-router.js";
import fileRouter from "@/routes/file-router.js";
import pageRouter from "@/routes/page-router.js";
import express from "express";

const apiRouter = express.Router();

apiRouter.get("/health", (_req, res) => {
  res.sendStatus(200);
});

apiRouter.get("/session", sessionController);

apiRouter.use(authRouter);

apiRouter.use("/pages", checkIfSignedIn, pageRouter);

apiRouter.use("/files", checkIfSignedIn, fileRouter);

export default apiRouter;
