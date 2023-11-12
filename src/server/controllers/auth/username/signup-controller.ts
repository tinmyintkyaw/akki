import typesenseClient from "@/configs/typesense-client-config";
import { auth } from "@/configs/lucia-config";
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

  // Generate new typesense key for every new session
  const newTypesenseKey = await typesenseClient.keys().create({
    description: `search-only key for user:${username}`,
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

export default asyncHandler(signupController);
