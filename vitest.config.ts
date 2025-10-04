import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.ts"],
    exclude: ["**/node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary"],
      all: true,
      include: ["**/*.ts"],
      exclude: ["**/dist/**", "**/node_modules/**", "**/*.test.ts"],
    },
  },
});
