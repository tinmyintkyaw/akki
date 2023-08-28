import { fetchPayload } from "@hocuspocus/server";
import { prisma } from "../lib/prismadb";

const fetchPage = (data: fetchPayload) => {
  return new Promise<Buffer>(async (resolve, reject) => {
    try {
      const page = await prisma.page.findUniqueOrThrow({
        where: {
          id_userId: {
            userId: data.context.userId,
            id: data.documentName,
          },
        },
      });

      if (!page.ydoc) throw new Error();

      return resolve(page.ydoc);
    } catch (error) {
      return reject();
    }
  });
};

export default fetchPage;
