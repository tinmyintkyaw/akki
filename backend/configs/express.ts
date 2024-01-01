import { errorHandler } from "@/middlewares/error-handler.js";
import { searchProxy } from "@/middlewares/search-proxy.js";
import express from "express";
import expressWebsockets from "express-ws";
import helmet from "helmet";

const { app } = expressWebsockets(express());

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.sendStatus(200));

app.use("/search/multi-search", searchProxy);

app.use("/*", (_req, res) => res.sendStatus(501));

app.use(errorHandler);

export { app as express };
