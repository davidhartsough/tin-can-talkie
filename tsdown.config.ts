import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["./src/index.ts"],
    format: "esm",
    platform: "browser",
    outDir: "./dist",
    minify: true,
    clean: false,
  },
]);
