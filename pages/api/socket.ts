import { authOptions } from "pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import * as crypto from "crypto";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const socketHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const socketToken = await prisma.socketSession.create({
    data: {
      socketToken: crypto.randomUUID(),
      expires: new Date(Date.now() + 60 * 60 * 1000),
      userId: session.accountId,
    },
  });

  res.status(200).json({ socketToken: socketToken.socketToken });
};

export default socketHandler;
