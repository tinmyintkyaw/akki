import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default function prismaHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {}
