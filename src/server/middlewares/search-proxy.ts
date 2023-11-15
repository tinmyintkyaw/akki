import envVars from "@/configs/env-config";
import { createProxyMiddleware } from "http-proxy-middleware";

const searchProxy = createProxyMiddleware({
  target: `http://${envVars.TYPESENSE_HOST}:${envVars.TYPESENSE_PORT}`,
  pathRewrite: { "^/search": "" },
  onProxyReq: (proxyReq, _req, res) => {
    proxyReq.setHeader(
      "x-typesense-api-key",
      res.locals.session.scopedSearchKey,
    );
  },
});

export default searchProxy;
