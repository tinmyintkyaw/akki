import sessionController from "@/controllers/session-controller.js";
import validateSession from "@/middlewares/validate-session.js";
import authRouter from "@/routes/auth-router.js";
import pageRouter from "@/routes/page-router.js";
import express from "express";

const apiRouter = express.Router();

apiRouter.get("/health", (_req, res) => {
  res.sendStatus(200);
});

apiRouter.get("/session", sessionController);

apiRouter.use(authRouter);

apiRouter.use("/pages", validateSession, pageRouter);

// apiRouter.use("/multiplayer", (req, res) => {});

// apiRouter.use("/search", (req, res) => {});

export default apiRouter;
