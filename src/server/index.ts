import apiRouter from "@/routes/api-router.js";
import express from "express";
import path from "path";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", apiRouter);

// TODO: use env file to get the path where static files are stored
app.use("/", express.static(path.join(process.cwd(), "dist/client")));

// Start the server
app.listen(3000, async () => {
  console.log("Listening on http://127.0.0.1:3000");
});
