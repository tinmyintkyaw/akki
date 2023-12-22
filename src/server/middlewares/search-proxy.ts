import envVars from "@/configs/env-config";
import { createProxyMiddleware } from "http-proxy-middleware";

const searchProxy = createProxyMiddleware({
  target: `http://${envVars.MEILI_HOST}:${envVars.MEILI_PORT}`,
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

export default searchProxy;
