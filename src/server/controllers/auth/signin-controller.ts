import { RequestHandler } from "express";
import { LuciaError } from "lucia";
import { auth } from "../../auth/lucia";

const signInController: RequestHandler = async (req, res) => {
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

    return res.status(302).json(session.user);
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
};

export default signInController;
