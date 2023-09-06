import express, { RequestHandler } from "express";
import { auth } from "./auth/lucia";
import { LuciaError } from "lucia";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const authMiddleware: RequestHandler = async (req, res, next) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (!session) return res.sendStatus(401);

  res.locals = session;
  next();
};

app.get("/health", (_req, res) => {
  res.sendStatus(200);
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string")
    return res.sendStatus(400);

  try {
    const user = await auth.createUser({
      key: {
        providerId: "username",
        providerUserId: username.toLocaleLowerCase(),
        password,
      },
      attributes: {
        username,
      },
    });

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest(req, res);
    authRequest.setSession(session);

    return res.status(302).json(session);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string")
    return res.status(400).end();

  try {
    const key = await auth.useKey(
      "username",
      username.toLocaleLowerCase(),
      password
    );

    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest(req, res);
    authRequest.setSession(session);

    return res.status(302).json(session);
  } catch (error) {
    if (
      error instanceof LuciaError &&
      (error.message === "AUTH_INVALID_KEY_ID" ||
        error.message === "AUTH_INVALID_PASSWORD")
    ) {
      return res.sendStatus(401);
    }

    return res.sendStatus(500);
  }
});

app.get("/user", authMiddleware, async (req, res) => {
  return res.status(200).json(res.locals);
});

app.post("/signout", async (req, res) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();

  if (!session) return res.sendStatus(401);

  await auth.invalidateSession(session.sessionId);
  return res.sendStatus(302);
});

// Start the server
app.listen(3300, async () => {
  console.log("Listening on http://127.0.0.1:3300");
});
