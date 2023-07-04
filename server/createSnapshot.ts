import * as Y from "yjs";
import { onChangePayload } from "@hocuspocus/server";

import { prisma } from "../lib/prismadb";

const createSnapshot = async (data: onChangePayload) => {
  console.log(`creating snapshot ${data.documentName}`);
  const notGCedYdoc = new Y.Doc({ gc: false });
};

export default createSnapshot;
