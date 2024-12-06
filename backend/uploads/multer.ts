import fs, { Stats } from "fs";
import multer from "multer";
import path from "path";
import { ulid } from "ulidx";

const multerStorage = multer.diskStorage({
  destination: (req, _file, callback) => {
    if (!req.res) throw new Error();

    const userId = req.res?.locals.session.userId;
    const uploadDir = path.join(process.cwd(), "uploads", userId);

    let stat: Stats | null = null;

    try {
      stat = fs.statSync(uploadDir);
    } catch (error) {
      fs.mkdirSync(uploadDir);
    }

    if (stat && !stat.isDirectory)
      throw new Error("Directory cannot be created");

    callback(null, uploadDir);
  },

  filename: (_req, file, callback) => {
    callback(null, `${ulid().toLowerCase()}${path.extname(file.originalname)}`);
  },
});

export const multerMiddleware = multer({
  storage: multerStorage,
  limits: {
    fieldNameSize: 100,
    fileSize: 5 * 1024 * 1024,
  },
});
