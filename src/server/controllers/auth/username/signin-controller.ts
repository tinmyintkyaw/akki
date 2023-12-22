import { auth } from "@/configs/lucia-config";
import createSession from "@/utils/create-session";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
} from "express-joi-validation";

interface UsernameSigninReqSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    username: string;
    password: string;
  };
}

const signInController: RequestHandler = async (
  req: ValidatedRequest<UsernameSigninReqSchema>,
  res,
) => {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string")
    return res.status(400).end();

  const key = await auth.useKey("username", username, password);

  const user = await auth.getUser(key.userId);

  const session = await createSession(user.userId);

  const authRequest = auth.handleRequest(req, res);
  authRequest.setSession(session);

  return res.status(302).setHeader("Location", "/").end();
};

export default asyncHandler(signInController);
