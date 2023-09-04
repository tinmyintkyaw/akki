import path from "path";
import fs from "fs/promises";
import { NextApiHandler, NextApiRequest } from "next";
import { Session, getServerSession } from "next-auth";
import formidable, { errors as formidableErrors } from "formidable";

import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prismadb";

const parseForm = async (
  req: NextApiRequest,
  session: Session
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise(async (resolve, reject) => {
    const uploadDir = path.join(process.cwd(), "uploads", session.accountId);

    try {
      await fs.stat(uploadDir);
    } catch (err: any) {
      if (err.code === "ENOENT") {
        await fs.mkdir(uploadDir, { recursive: true });
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
          (part.name === "image" && part.mimetype?.includes("image")) ||
          part.name === "id" ||
          false
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

      const pageId = Array.isArray(fields.pageId)
        ? fields.pageId[0]
        : fields.pageId;

      const newFilename = Array.isArray(files.image)
        ? files.image.map((file) => file.newFilename)
        : files.image.newFilename;

      await prisma.file.create({
        data: {
          userId: session.accountId,
          pageId: pageId,
          fileName: Array.isArray(newFilename) ? newFilename[0] : newFilename,
        },
      });

      const url = `${req.headers.host}/api/images/${
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
