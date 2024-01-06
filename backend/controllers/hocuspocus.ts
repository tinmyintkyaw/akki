import { hocuspocusServer } from "@/configs/hocuspocus.js";
import { WebsocketRequestHandler } from "express-ws";
import requestIp from "request-ip";

export const hocuspocusHandler: WebsocketRequestHandler = (websocket, req) => {
  const clientIp = requestIp.getClientIp(req);
  hocuspocusServer.handleConnection(websocket, req, { clientIp });
};
