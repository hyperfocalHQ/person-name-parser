import { defineConfig } from "rolldown";

export default defineConfig({
  platform: "node",
  tsconfig: "./tsconfig.json",
  input: "src/parser.ts",
  output: {
    file: "dist/parser.js",
  },
});
