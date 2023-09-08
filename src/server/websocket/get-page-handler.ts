import prisma from "@/db/prisma-client.js";
import { fetchPayload } from "@hocuspocus/server";

const getPageHandler = async (data: fetchPayload) => {
  const page = await prisma.page.findUniqueOrThrow({
    where: {
      id_userId: {
        userId: data.context.userId,
        id: data.documentName,
      },
    },
  });

  if (!page.ydoc) throw new Error();

  return page.ydoc;
};

export default getPageHandler;
