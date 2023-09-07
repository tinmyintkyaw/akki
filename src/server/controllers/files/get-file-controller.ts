import { Request, RequestHandler } from "express";
import fs from "fs";
import path from "path";

const getFileController: RequestHandler = async (
  req: Request<{ fileId: string }>,
  res,
  next
) => {
  if (res.locals.session) return res.sendStatus(401);

  try {
    const filePath = path.join(
      process.env.UPLOAD_DIR,
      res.locals.session.user.userId,
      req.params.fileId
    );

    fs.statSync(filePath);

    const fileBuffer = fs.readFileSync(filePath);

    return res.send(fileBuffer);
  } catch (error) {
    next(error);
  }
};

export default getFileController;
