import { typesenseClient } from "@/index.js";
import { auth } from "@/lucia.js";
import { RequestHandler } from "express";

const signupController: RequestHandler = async (req, res) => {
  const { username, name, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string")
    return res.sendStatus(400);

  try {
    const user = await auth.createUser({
      key: {
        providerId: "username",
        providerUserId: username.toLocaleLowerCase(),
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
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default signupController;
