import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

export default async function prismaHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await prisma.session.findMany();
  res.status(200).json(data);
}
