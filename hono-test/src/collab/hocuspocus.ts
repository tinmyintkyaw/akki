import { auth } from "#/auth/auth.js";
import { Hocuspocus } from "@hocuspocus/server";

interface HocuspocusContext {
  session: (typeof auth.$Infer)["Session"] | null;
  spaceId: string;
  pageId: string;
}

export const hocuspocus = new Hocuspocus<HocuspocusContext>({
  async onListen(data) {},

  async onAuthenticate(data) {
    const session = await auth.api.getSession({ headers: data.requestHeaders });
  },
});
