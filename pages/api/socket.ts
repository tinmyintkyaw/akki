import { Server } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { NextApiRequest, NextApiResponse } from "next";

const socketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const server = Server.configure({
    port: 3001,

    async onStoreDocument(data) {
      const json = TiptapTransformer.fromYdoc(data.document);
      console.log(json);
    },
  });
  server.listen();
  res.end();
};

export default socketHandler;
