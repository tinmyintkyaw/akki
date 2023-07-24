import { NextApiHandler } from "next";
import { getServerSession } from "next-auth";
import path from "path";
import fs from "fs";

import { authOptions } from "../auth/[...nextauth]";

const imageDownloadHandler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { imageId } = req.query;

  if (typeof imageId !== "string")
    return res.status(500).json({ message: "Invalid image ID" });

  if (req.method === "GET") {
    try {
      const imagePath = path.join(
        process.cwd(),
        "uploads",
        session.accountId,
        imageId
      );

      fs.statSync(imagePath);

      const imageBuffer = fs.readFileSync(imagePath);

      res.setHeader("Content-Type", "image/png");
      return res.send(imageBuffer);
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error", err });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
};

export default imageDownloadHandler;
