import redisClient from "@/configs/ioredis-config";
import { auth } from "@/configs/lucia-config";
import typesenseClient from "@/configs/typesense-client-config";
import { RequestHandler } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { UsernameSigninReqSchema } from "./signin-controller";

export const signInController: RequestHandler = async (
  req: ValidatedRequest<UsernameSigninReqSchema>,
  res,
) => {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string")
    return res.status(400).end();

  const key = await auth.useKey("username", username, password);

  const user = await auth.getUser(key.userId);

  const defaultSearchKey = await redisClient.get("search:defaultKey");

  const session = await auth.createSession({
    userId: key.userId,
    attributes: {
      scoped_search_key: typesenseClient
        .keys()
        .generateScopedSearchKey(defaultSearchKey, {
          filter_by: `userId:${user.userId}`,
        }),
    },
  });

  const authRequest = auth.handleRequest(req, res);
  authRequest.setSession(session);

  return res.status(302).setHeader("Location", "/").end();
};
