import { auth } from "@/configs/lucia-config";
import typesenseClient from "@/configs/typesense-client-config";
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

  const newTypesenseKey = await typesenseClient.keys().create({
    description: `search-only key for user:${username}`,
    actions: ["documents:search"],
    collections: ["pages"],
  });

  const key = await auth.useKey("username", username, password);

  const session = await auth.createSession({
    userId: key.userId,
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

export default asyncHandler(signInController);
