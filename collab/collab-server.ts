import { Server } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { getToken } from "next-auth/jwt";

const server = Server.configure({
  port: 3001,
  async onConnect(data) {
    console.log(data.connection);
  },
  async onStoreDocument(data) {
    const json = TiptapTransformer.fromYdoc(data.document);
    // console.log(json);
  },
  //   onAuthenticate(data) {

  //   },
});

server.listen();
