import { parsedProcessEnv } from "@/configs/env-variables.js";
import { createProxyMiddleware } from "http-proxy-middleware";

const { MEILI_HOST, MEILI_PORT } = parsedProcessEnv;

const searchProxy = createProxyMiddleware({
  target: `http://${MEILI_HOST}:${MEILI_PORT}`,
  pathRewrite: { "^/search": "" },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader(
      "Authorization",
      `Bearer ${res.locals.session.scopedSearchKey}`,
    );

    const bodyJSONString = JSON.stringify(req.body);
    proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyJSONString));
    proxyReq.write(bodyJSONString);
    proxyReq.end();
  },
});

export { searchProxy };
