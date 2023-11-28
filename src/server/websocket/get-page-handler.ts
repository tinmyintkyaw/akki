import prisma from "@/configs/prisma-client-config";
import { fetchPayload } from "@hocuspocus/server";
import * as Y from "yjs";

const getPageHandler = async (data: fetchPayload) => {
  const page = await prisma.page.findUniqueOrThrow({
    where: {
      id_user_id: {
        user_id: data.context.userId,
        id: data.documentName,
      },
    },
  });

  if (!page.ydoc) return Buffer.from(Y.encodeStateAsUpdate(new Y.Doc()));

  return page.ydoc;
};

export default getPageHandler;
