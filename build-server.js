import * as esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";

(async () => {
  await esbuild.build({
    entryPoints: ["./src/server/index.ts"],
    bundle: true,
    minify: true,
    platform: "node",
    tsconfig: "./src/server/tsconfig.json",
    outfile: "./dist/server/index.cjs",
    logLevel: "info",
    plugins: [
      copy({
        resolveFrom: "cwd",
        assets: [
          {
            from: ["./prisma/*"],
            to: ["./dist/server"],
          },
          {
            from: ["./node_modules/prisma/libquery_engine-*"],
            to: ["./dist/server"],
          },
        ],
      }),
    ],
  });
})();
