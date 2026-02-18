import { parsedProcessEnv } from "@/validation/env-vars-validator.js";
import proxy from "express-http-proxy";
import { OutgoingHttpHeaders } from "http";
import url from "url";

const meilisearchHostURL = url.format({
  protocol: "http",
  hostname: parsedProcessEnv.MEILI_HOST,
  port: parsedProcessEnv.MEILI_PORT,
});

export const meilisearchProxy = proxy(`${meilisearchHostURL}`, {
  filter(req) {
    return req.method === "POST" && req.path === "/multi-search";
  },
  async proxyReqOptDecorator(proxyReqOpts, srcReq) {
    if (!proxyReqOpts.headers) return proxyReqOpts;

    // modify headers with bearer token
    const headers = proxyReqOpts.headers as OutgoingHttpHeaders;
    headers["authorization"] = `Bearer ${srcReq.res?.locals.searchToken}`;

    return proxyReqOpts;
  },
});
