import { Hocuspocus } from "@hocuspocus/server";

export const hocuspocus = new Hocuspocus({
  async onListen(data) {
    console.log("listen");
  },
  async onAuthenticate(data) {
    console.log("auth");
  },
});
