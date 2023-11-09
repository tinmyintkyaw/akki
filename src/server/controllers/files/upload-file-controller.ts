import prisma from "@/db/prisma-client.js";
import parseForm from "@/utils/parse-form.js";
import { RequestHandler } from "express";

const uploadFileController: RequestHandler = async (req, res) => {
  const { fields, files } = await parseForm(req, res);

  if (!fields.pageId || !files.file) return res.sendStatus(500);

  const fileName = files.file[0].newFilename;

  await prisma.file.create({
    data: {
      userId: res.locals.session.user.userId,
      pageId: fields.pageId[0],
      fileName: fileName,
    },
  });

  const url = `${req.headers.host}/api/files/${fileName}`;

  return res.status(200).json({ url });
};

export default uploadFileController;
