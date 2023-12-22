import { auth, googleAuth } from "@/configs/lucia-config";
import createSession from "@/utils/create-session";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { parseCookie } from "lucia/utils";

const googleSignInCallbackController: RequestHandler = async (req, res) => {
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

  const session = await createSession(user.userId);

  const authRequest = auth.handleRequest(req, res);
  authRequest.setSession(session);

  return res.status(302).setHeader("Location", "/").end();
};

export default asyncHandler(googleSignInCallbackController);
