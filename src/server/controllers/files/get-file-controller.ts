import { Request, RequestHandler } from "express";
import fs from "fs";
import path from "path";

const getFileController: RequestHandler = async (
  req: Request<{ fileId: string }>,
  res,
) => {
  if (res.locals.session) return res.sendStatus(401);

  const filePath = path.join(
    process.cwd(),
    "uploads",
    res.locals.session.user.userId,
    req.params.fileId,
  );

  fs.statSync(filePath);

  const fileBuffer = fs.readFileSync(filePath);

  return res.send(fileBuffer);
};

export default getFileController;
