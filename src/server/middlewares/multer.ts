import fs, { Stats } from "fs";
import multer from "multer";
import path from "path";

const multerStorage = multer.diskStorage({
  destination: (req, _file, callback) => {
    const uploadDir = path.join(
      process.cwd(),
      "uploads",
      req.res.locals.session.user.userId,
    );

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
    callback(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`);
  },
});

const multerMiddleware = multer({
  storage: multerStorage,
  limits: {
    fieldNameSize: 100,
    fileSize: 5 * 1024 * 1024,
  },
});

export default multerMiddleware;
