import { getPage } from "@/collaboration/services/get-page";
import { storePage } from "@/collaboration/services/store-page";
import { Database } from "@hocuspocus/extension-database";
import { Throttle } from "@hocuspocus/extension-throttle";
import { Hocuspocus } from "@hocuspocus/server";
import { FastifyInstance } from "fastify";

export interface CustomContext {
  pageId: string;
  spaceId: string;
  userId: string;
}

export const createHocuspocusInstance = (fastify: FastifyInstance) => {
  const { db } = fastify;

  return new Hocuspocus({
    extensions: [
      new Throttle(),
      new Database({
        fetch: async ({ context }) => {
          const { userId, spaceId, pageId } = context as CustomContext;

          const page = await getPage(db, { userId, spaceId, pageId });

          return page.ydoc;
        },

        store: async ({ context, state }) => {
          const { userId, spaceId, pageId } = context as CustomContext;

          await storePage(db, { userId, spaceId, pageId, ydoc: state });
        },
      }),
    ],
  });
};
