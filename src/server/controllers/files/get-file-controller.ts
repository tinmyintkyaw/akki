import { Request, RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";

const getFileController: RequestHandler = async (
  req: Request<{ fileId: string }>,
  res,
) => {
  const filePath = path.join(
    process.cwd(),
    "uploads",
    res.locals.session.user.userId,
    req.params.fileId,
  );

  fs.statSync(filePath);

  return res.sendFile(filePath);
};

export default asyncHandler(getFileController);
