import { typesenseClient } from "@/index.js";
import { auth, githubAuth } from "@/lucia.js";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { parseCookie } from "lucia/utils";

const githubSignInCallbackController: RequestHandler = async (req, res) => {
  const cookies = parseCookie(req.headers.cookie ?? "");
  const storedState = cookies.github_oauth_state;
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

  const { getExistingUser, githubUser, createUser } =
    await githubAuth.validateCallback(code);

  const getUser = async () => {
    const existingUser = await getExistingUser();
    if (existingUser) return existingUser;

    const user = createUser({
      attributes: {
        name: githubUser.name,
        image: githubUser.avatar_url,
        email: githubUser.email,
        email_verified: false,
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
};

export default asyncHandler(githubSignInCallbackController);
