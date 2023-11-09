import { typesenseClient } from "@/index.js";
import { auth, googleAuth } from "@/lucia.js";
import { RequestHandler } from "express";
import { parseCookie } from "lucia/utils";

const googleSignInCallbackController: RequestHandler = async (
  req,
  res,
  next,
) => {
  const cookies = parseCookie(req.headers.cookie ?? "");
  const storedState = cookies.google_oauth_state;
  const { state, code } = req.query;

  // validate state
  if (
    !storedState ||
    !state ||
    storedState !== state ||
    typeof code !== "string"
  ) {
    return res.sendStatus(400);
  }

  try {
    const { getExistingUser, googleUser, createUser } =
      await googleAuth.validateCallback(code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;

      const user = createUser({
        attributes: {
          name: googleUser.name,
          image: googleUser.picture,
          email: googleUser.email,
          email_verified: googleUser.email_verified,
        },
      });

      return user;
    };

    const user = await getUser();

    // Generate new typesense key for every new session
    const newTypesenseKey = await typesenseClient.keys().create({
      description: `search-only key for user:${user.userId}`,
      actions: ["documents:search"],
      collections: ["pages"],
    });

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {
        editorKey: crypto.randomUUID(),
        typesenseKeyId: newTypesenseKey.id.toString(),
        typesenseKeyValue: newTypesenseKey.value,
      },
    });

    const authRequest = auth.handleRequest(req, res);
    authRequest.setSession(session);

    return res.status(302).setHeader("Location", "/").end();
  } catch (error) {
    next(error);
  }
};

export default googleSignInCallbackController;
