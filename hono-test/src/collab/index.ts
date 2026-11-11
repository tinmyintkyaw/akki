import { hocuspocus } from "#/collab/hocuspocus.js";
import { upgradeWebSocket } from "@hono/node-server"; // 👈 upgradeWebSocket comes from node-server directly
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { WebSocket } from "ws"; // 👈 Required by the new built-in engine
import z from "zod";

const paramsSchema = z.object({ spaceId: z.string(), pageId: z.string() });
const validator = zValidator("param", paramsSchema);

const app = new Hono();

app.get(
  "/collab/:spaceId/:pageId",
  validator,
  upgradeWebSocket((c) => {
    type ValidatedContext = Parameters<typeof validator>[0];
    const validParams = (c as ValidatedContext).req.valid("param");

    let clientConnection: any;
    return {
      onOpen(_evt, ws) {
        const nodeWs = ws.raw as WebSocket;
        nodeWs.binaryType = "arraybuffer";

        clientConnection = hocuspocus.handleConnection(
          nodeWs,
          c.req.raw,
          // pass values to custom context
          {
            session: null,
            spaceId: validParams.spaceId,
            pageId: validParams.pageId,
          },
        );
      },
      onMessage(evt) {
        clientConnection?.handleMessage(
          new Uint8Array(evt.data as ArrayBuffer),
        );
      },
      onClose() {
        clientConnection?.handleClose();
      },
    };
  }),
);

export default app;
