import path from "path";
import fs from "fs";
import { NextApiHandler, NextApiRequest } from "next";
import { Session, getServerSession } from "next-auth";
import formidable, { errors as formidableErrors } from "formidable";

import { authOptions } from "../auth/[...nextauth]";

const parseForm = async (
  req: NextApiRequest,
  session: Session
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise(async (resolve, reject) => {
    const uploadDir = path.join(process.cwd(), "uploads", session.accountId);

    try {
      fs.statSync(uploadDir);
    } catch (err: any) {
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
      filter: (part) => {
        return (
          (part.name === "image" && part.mimetype?.includes("image")) || false
        );
      },
      filename(name, ext, part, form) {
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

const imageUploadHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "POST") {
    try {
      const { fields, files } = await parseForm(req, session);

      const newFilename = Array.isArray(files.image)
        ? files.image.map((file) => file.newFilename)
        : files.image.newFilename;

      // TODO: derive base url from env file
      const url = `http://localhost:3000/api/images/${
        Array.isArray(newFilename) ? newFilename[0] : newFilename
      }`;

      return res.status(200).json({ url });
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default imageUploadHandler;
