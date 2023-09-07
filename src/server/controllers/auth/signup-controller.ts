import { RequestHandler } from "express";
import { auth } from "@/lucia.js";
import typesenseClient from "@/db/typesense-client.js";

const signupController: RequestHandler = async (req, res) => {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string")
    return res.sendStatus(400);

  try {
    const newTypesenseKey = await typesenseClient.keys().create({
      actions: ["documents:search"],
      collections: ["pages"],
    });

    const user = await auth.createUser({
      key: {
        providerId: "username",
        providerUserId: username.toLocaleLowerCase(),
        password,
      },
      attributes: {
        username,
        searchKey: newTypesenseKey.value,
        searchKeyId: newTypesenseKey.id,
      },
    });

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {
        editorKey: crypto.randomUUID(),
      },
    });

    const authRequest = auth.handleRequest(req, res);
    authRequest.setSession(session);

    return res.status(302).json(session.user);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default signupController;
