import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["./src/index.ts"],
    format: "esm",
    platform: "browser",
    outDir: "./",
    minify: true,
    clean: false,
    deps: {
      onlyBundle: ["@metered-ca/realtime"],
      alwaysBundle: ["@metered-ca/realtime"],
    },
  },
]);
