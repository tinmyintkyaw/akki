import express from "express";
import sessionController from "../controllers/session-controller";
import authRouter from "./auth-router";
import pageRouter from "./page-router";

const apiRouter = express.Router();

apiRouter.get("/health", (_req, res) => {
  res.sendStatus(200);
});

apiRouter.get("/session", sessionController);

apiRouter.use(authRouter);

apiRouter.use("/pages", pageRouter);

// apiRouter.use("/multiplayer", (req, res) => {});

// apiRouter.use("/search", (req, res) => {});

export default apiRouter;
