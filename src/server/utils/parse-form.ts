import { Request, Response } from "express";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const parseForm = async (
  req: Request,
  res: Response
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const uploadDir = path.join(
      process.env.UPLOAD_DIR,
      res.locals.session.user.userId
    );

    try {
      fs.statSync(uploadDir);
    } catch (err) {
      if (err.code === "ENOENT") {
        fs.mkdirSync(uploadDir, { recursive: true });
      } else {
        reject(err);
        return;
      }
    }

    const form = formidable({
      maxFiles: 1,
      maxFileSize: 5 * 1024 * 1024,
      keepExtensions: true,
      filter: (part) => part.name === "file" || part.name === "pageId" || false,
      filename(_name, ext) {
        const uniqueFilename = `${crypto.randomUUID()}${ext}`.toLowerCase();
        return uniqueFilename;
      },
      uploadDir,
    });

    form.parse(req, function (err, fields, files) {
      if (err) reject(err);
      if (Object.keys(files).length === 0) reject(new Error("No file"));
      resolve({ fields, files });
    });
  });
};

export default parseForm;
