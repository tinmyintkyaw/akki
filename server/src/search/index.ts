import { sessionMiddleware } from "#/auth/session-middleware.js";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { generateTenantToken } from "meilisearch/token";
import { getDefaultSearchKey } from "./get-default-search-key.js";

const app = new Hono();

const defaultSearchKey = await getDefaultSearchKey();

app.get("/search/key", sessionMiddleware, async (c) => {
  const { session } = c.get("session");

  try {
    const searchToken = await generateTenantToken({
      apiKey: defaultSearchKey.key,
      apiKeyUid: defaultSearchKey.uid,
      expiresAt: Date.now() + 5 * 60 * 1000,
      searchRules: {
        pages: {
          filter: `allowedUserIds = ${session.userId}`,
        },
      },
    });

    return c.json({ key: searchToken });
  } catch (error) {
    throw new HTTPException(400);
  }
});

export default app;
