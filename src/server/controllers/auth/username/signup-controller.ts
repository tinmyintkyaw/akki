import { auth } from "@/configs/lucia-config";
import createSession from "@/utils/create-session";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
} from "express-joi-validation";

interface UsernameSignupReqSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    username: string;
    name: string;
    password: string;
  };
}

const signupController: RequestHandler = async (
  req: ValidatedRequest<UsernameSignupReqSchema>,
  res,
) => {
  const { username, name, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string")
    return res.sendStatus(400);

  const user = await auth.createUser({
    key: {
      providerId: "username",
      providerUserId: username,
      password,
    },
    attributes: {
      name,
      username,
    },
  });

  const session = await createSession(user.userId);

  const authRequest = auth.handleRequest(req, res);
  authRequest.setSession(session);

  return res.status(302).setHeader("Location", "/").end();
};

export default asyncHandler(signupController);
